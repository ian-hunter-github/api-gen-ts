# Auto-Generated Form Components from ApiConfig

## 1. Component Generation Rules

### 1.1 File Structure
#### 1.1.1 For each generated object:
##### 1.1.1.1 Create folder under `src/components/autoGen/[TypeName]`
##### 1.1.1.2 For [TypeName]Form,Dialog,Inputs,Table, create a sub-folder with appropriate .tsx, stories.tsx and index.ts files. This is standard reactjs folder structure.
##### 1.1.1.3 Include test harness (`__tests__/[TypeName].test.tsx`)
##### 1.1.1.4 Include Storybook file (`[TypeName].stories.tsx`)
##### 1.1.1.5 For each object created, use a separate folder that holds
###### 1.1.1.4.1 source file
###### 1.1.1.4.1 css file
###### 1.1.1.4.1 storybook file
###### 1.1.1.4.1 test file, under __tests__

### 1.2 Naming Conventions
| # | Component Type | Pattern | Example |
|---|---------------|---------|---------|
| 1.2.1 | Dialog | `[TypeName]Dialog` | `ApiConfigDialog` |
| 1.2.2 | Form | `[TypeName]Form` | `ApiConfigForm` |
| 1.2.3 | Table | `[ArrayName]Table` | `EndpointsTable` |
| 1.2.4 | Input | `[FieldName]Input` | `NameInput` |

## 2. Data Management

### 2.1 Storage
#### 2.1.1 ApiConfig data stored under its ID in the store
#### 2.1.2 Initial form displays store data as read-only

### 2.2 Edit Flow
#### 2.2.1 User clicks "Edit" button (top-right)
#### 2.2.2 System creates deep copy for editing
#### 2.2.3 Changes are local until saved
#### 2.2.4 Unsaved changes are discarded on close

### 2.3 Button States
#### 2.3.1 Save/Cancel buttons start disabled
#### 2.3.2 Enabled when any field is modified

## 3. Field Type Handling

### 3.1 Primitive Fields
| # | Field Type | Component | Notes |
|---|------------|-----------|-------|
| 3.1.1 | string | Text input | |
| 3.1.2 | limited string | Dropdown | Values from schema |
| 3.1.3 | large string | Textarea | |
| 3.1.4 | number | Text input | |
| 3.1.5 | limited number | Dropdown | |
| 3.1.6 | number range | Range input | Min/max from schema |
| 3.1.7 | boolean | Toggle switch | |
| 3.1.8 | date/time | Date/time picker | |
| 3.1.9 | URL/email | Specialized input | With validation |

### 3.2 Validation
#### 3.2.1 Show validation messages for invalid fields
#### 3.2.2 Readonly fields display as plain text

### 3.3 Optional Field Handling

#### 3.4 General Rules
| # | Field Type | Behavior | Example |
|---|------------|----------|---------|
| 3.4.1 | Primitive | Always show UI element, populate with default if specified or blank | `basePath: string` → Text input with "" |
| 3.4.2 | Table/Array | Always show empty table, allow row additions | `entities: Entity[]` → Empty table with "Add" button |
| 3.4.3 | Complex Object | Show "Add" button, creates temporary form on click | `security: SecurityConfig` → Button that opens form |

#### 3.7 Temporary Form Workflow
##### 3.7.1 User clicks "Add" button for complex optional field
##### 3.7.1 System creates temporary form with:
1. Default values from schema
2. Save/Cancel buttons
##### 3.7.2 On Save:
1. Commits object to configuration
2. Replaces button with active form
##### 3.7.3 On Cancel:
1. Discards temporary form
2. Returns to "Add" button state

#### 3.8 Implementation Notes
##### 3.8.1 All schema paths must generate UI elements
##### 3.8.2 Empty states should be clearly indicated
##### 3.8.3 Complex object forms should include:
  ```typescript
  interface TemporaryFormProps {
    initialValues: object;
    onSave: (values: object) => void;
    onCancel: () => void;
  }
  ```

## 4. Complex Objects

### 4.1 Component Structure
#### 4.1.1 For each complex type:
##### 4.1.1.1 `[TypeName]Dialog` (container)
##### 4.1.1.2 `[TypeName]Form` (content)
##### 4.1.1.3 Uses `TanStackTable` for arrays

### 4.2 Behavior
#### 4.2.1 Configuration button opens dialog
#### 4.2.2 Background highlights yellow on changes
#### 4.2.3 Changes tracked locally until saved
#### 4.2.4 Saved changes propagate to parent

## 5. Array Handling

### 5.1 Table Generation
#### 5.1.1 Arrays become `TanStackTable` components
#### 5.1.2 Named as `[ArrayName]Table`

### 5.2 Editing Behavior
| # | Field Type | Edit Method |
|---|------------|-------------|
| 5.2.1 | Primitive | In-place (double click) |
| 5.2.2 | Complex | Modal dialog |
| 5.2.3 | Nested array | Nested modal with table |

## 6. Form Behavior

### 6.1 Updates
#### 6.1.1 Only dirty fields trigger updates
#### 6.1.2 Save passes updated object to parent
#### 6.1.3 Cancel resets to original values
