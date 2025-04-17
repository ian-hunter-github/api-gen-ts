The form generation from ApiConfig type follows these rules:

1. Primitive Fields:

1.1 string fields become text inputs
1.1.1 limited string fields (those with a limited set of values) become dropdowns
1.1.2 If the value is likely to be large, use a textarea
1.2 number fields become text fields. if validation is present, and values are limited, then a dropdown is used
1.2.1 Number fields with min/max constraints use range inputs where appropriate
1.3 boolean fields become toggle switches
1.4 date, time, date-time fields open a picker as appropriate (AI to choose best library)
1.4 all fields with validation, get validation performed (red outline + message)
1.5 readonly fields get plain text values disaplayed
1.6 URL/email fields use specialized inputs with built-in validation


2. Complex Objects:

2.1 Each complex object (security, deployment, etc.) gets a configuration button.
2.2 A configuration button goes yellow background when a modification is made in the dialog.
2.3 Button icons indicate the object type (uses icon)
2.4 For each Button, create a ModalDialog component based on the data type name (e.g. EntityAttribute becomes AntityAttributeDialog.tsx). This dialog recieves a copy of the data as per the type.
2.5 The Button will open this dialog.
2.6 Configuration buttons don't trigger form submission
2.7 For generating the code for this dialog, start these rules again with the appropriate object. (i.e. Go to (1))
2.8 Dialogs must track changes locally until explicitly saved, then propagate to parent

3. Arrays:

3.4 Name array table components as [ArrayName]Table (e.g. EntitiesTable for entities array)
3.5 Tables must include add/remove/reorder row actions when mutable

4. Naming Conventions

4.1 All generated components must follow these patterns:
4.1.1 Dialogs: [TypeName]Dialog
4.1.2 Tables: [ArrayName]Table
4.1.3 Inputs: [FieldName]Input

4.2 Use BEM naming convention for CSS classes:
.config-button--[type]
.dialog--[type]
.table--[array-type]

5. Validation Inheritance

5.1 All validation rules must propagate to nested components:
5.1.1 Complex object dialogs inherit parent field validation
5.1.2 Array items inherit array element validation

6. Complete Example

6.1 For an API config with:
- string name
- security object 
- entities array
Generate:
1. Text input for name
2. SecurityConfig button opening SecurityDialog
   2.1 Dialog contains recursively generated fields
3. EntitiesTable with:
   3.1 Inline editing for primitive fields
   3.2 Buttons for complex fields opening dialogs

1. Arrays:

3.1 Arrays become tables.
3.2 Tables allow viewing/editing individual items
3.3 To generate the table, use the generic TanStackTable and follow these rules:
   3.3.1 Primitive Fields, as per (10), but editable in place by a double click.
   3.3.2 Complex Type. A button that opens a new modal dialog created and implemented as per (2).
   3.3.3 Arrays. Create another Modal Dialog which contains a table, implemented as (3)

Form Behavior:

Only dirty fields trigger updates
Save passes the updated object to the parent, which then places it in the data structure.
Cancel button resets to original values
