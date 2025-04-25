import { Project } from "ts-morph";
import fs from "fs-extra";
import path from "path";
import Handlebars from "handlebars";
import minimist from "minimist";

// Parse command line arguments
const args = minimist(process.argv.slice(2));
const isTestMode = args.t || args.test;

// Paths
const TYPES_PATH = "src/types/all.types.ts";
const COMPONENTS_ROOT = "src/components/autoGen";
const TEMPLATES_DIR = "templates";

// Load project
const project = new Project();
const source = project.addSourceFileAtPath(TYPES_PATH);
console.log("✅ Loaded types from:", TYPES_PATH);

// Handlebars helpers
Handlebars.registerHelper("hasError", (_, field) => `errors?.${field}`);
Handlebars.registerHelper("isDirty", (_, field) => `dirtyFields?.${field}`);
Handlebars.registerHelper("placeholder", (field) => `Type ${field} here`);

// String manipulation
Handlebars.registerHelper("lowercase", (str) => str?.toLowerCase());
Handlebars.registerHelper("uppercase", (str) => str?.toUpperCase());

// Array operations
Handlebars.registerHelper("join", (arr, sep) => arr?.join(sep || ', '));
Handlebars.registerHelper("first", (arr) => arr?.[0]);
Handlebars.registerHelper("last", (arr) => arr?.[arr.length - 1]);

// Comparison
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("neq", (a, b) => a !== b);

// JSON
Handlebars.registerHelper("json", (obj) => JSON.stringify(obj, null, 2));

// Array includes
Handlebars.registerHelper("includes", (arr, val) => arr?.includes(val));

// Form generation helpers
Handlebars.registerHelper("getValidationRules", (prop) => {
  const jsDocs = prop.getJsDocs();
  if (!jsDocs.length) return '';
  
  const rules = [];
  const tags = jsDocs[0].getTags();
  
  tags.forEach(tag => {
    const tagName = tag.getTagName();
    const text = tag.getText();
    
    switch(tagName) {
      case 'required':
        rules.push('required: true');
        break;
      case 'min':
        rules.push(`min: ${text}`);
        break;
      case 'max':
        rules.push(`max: ${text}`);
        break;
      case 'pattern':
        rules.push(`pattern: /${text}/`);
        break;
      case 'email':
        rules.push('pattern: /^\\S+@\\S+\\.\\S+$/');
        break;
    }
  });
  
  return rules.length ? `{ ${rules.join(', ')} }` : '';
});

Handlebars.registerHelper("getFormControlType", (prop) => {
  const type = prop.getType().getText();
  
  if (type.includes('boolean')) return 'checkbox';
  if (type.includes('string')) {
    const jsDocs = prop.getJsDocs();
    if (jsDocs.length) {
      const tags = jsDocs[0].getTags();
      if (tags.some(t => t.getTagName() === 'multiline')) {
        return 'textarea';
      }
    }
    return 'text';
  }
  if (type.includes('number')) return 'number';
  return 'text';
});

Handlebars.registerHelper("formatLabel", (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
});

Handlebars.registerHelper("getDefaultValue", (prop) => {
  const type = prop.getType().getText();
  if (type.includes('boolean')) return 'false';
  if (type.includes('number')) return '0';
  return "''";
});

// Load templates
const formTemplate = Handlebars.compile(
  fs.readFileSync(path.join(TEMPLATES_DIR, "Form.hbs"), "utf-8")
);
const storyTemplate = Handlebars.compile(
  fs.readFileSync(path.join(TEMPLATES_DIR, "Form.stories.hbs"), "utf-8")
);

// Log types in detailed format
function logTypes(interfaces) {
  console.log("🔍 Type Listing (Test Mode)");
  console.log("──────────────────────────");
  
  for (const iface of interfaces) {
    console.log(`Interface: ${iface.getName()}`);
    console.log("  Properties:");
    
    for (const prop of iface.getProperties()) {
      const type = prop.getType().getText();
      const optional = prop.hasQuestionToken() ? "optional" : "required";
      console.log(`  - ${prop.getName()}: ${type} (${optional})`);
    }
    console.log();
  }
}

// Process interfaces
const interfaces = source.getInterfaces();

if (isTestMode) {
  logTypes(interfaces);
  process.exit(0);
}

console.log(`📦 Found ${interfaces.length} interfaces`);

// Filter to only process ApiConfig interface
const targetInterface = interfaces.find(i => i.getName() === 'ApiConfig');
if (!targetInterface) {
  console.error('❌ Could not find ApiConfig interface');
  process.exit(1);
}

const typeName = targetInterface.getName();
console.log(`🔧 Processing interface: ${typeName}`);
const props = targetInterface.getProperties().map((prop) => {
    const type = prop.getType().getText();
    const jsDocs = prop.getJsDocs();
    let description = prop.getName();
    let validation = {};
    
    if (jsDocs.length) {
      const tags = jsDocs[0].getTags();
      description = jsDocs[0].getDescription() || description;
      
      tags.forEach(tag => {
        const tagName = tag.getTagName();
        const text = tag.getText();
        
        switch(tagName) {
          case 'required':
            validation.required = true;
            break;
          case 'min':
            validation.min = Number(text);
            break;
          case 'max':
            validation.max = Number(text);
            break;
          case 'pattern':
            validation.pattern = new RegExp(text);
            break;
          case 'email':
            validation.pattern = /^\S+@\S+\.\S+$/;
            break;
        }
      });
    }

    let inputType = 'string';
    if (type.includes('boolean')) inputType = 'boolean';
    else if (type.includes('number')) inputType = 'number';
    else if (type.includes('Date')) inputType = 'string';

    return {
      name: prop.getName(),
      description: description,
      type: inputType,
      value: type.includes('boolean') ? false : type.includes('number') ? 0 : '',
      maxLength: validation.max,
      required: !prop.hasQuestionToken(),
      validation,
      enumValues: type.includes('|') ? type.split('|').map(s => s.trim().replace(/['"]/g, '')) : undefined
    };
  });

const context = { 
    typeName, 
    fields: props,
    title: `${typeName} Form`,
    isDirty: false,
    hasErrors: false,
    onChange: 'handleChange',
    onReset: 'handleReset',
    onValidate: 'handleValidate'
  };

  console.log('📋 Template context:');
  console.log(JSON.stringify(context, null, 2));
  console.log('First field details:');
  console.log(JSON.stringify(props[0], null, 2));

const outDir = path.join(COMPONENTS_ROOT, typeName);
  fs.ensureDirSync(outDir);

  // Generate Form
  fs.writeFileSync(
    path.join(outDir, `${typeName}Form.tsx`),
    formTemplate(context)
  );

  // Generate Story
  fs.writeFileSync(
    path.join(outDir, `${typeName}Form.stories.tsx`),
    storyTemplate(context)
  );

  console.log(`✅ Generated: ${typeName}/[Form.tsx, stories.tsx]`);
  console.log("🎉 All components generated into src/components/autoGen/");
