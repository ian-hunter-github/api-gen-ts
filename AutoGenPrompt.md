The form generation from ApiConfig type follows these rules:

1. Code Generation
  1.1 For each object generated here, create an appropriate folder under src/components/autoGen
  1.2 For each object we need to create a test harness (under __tests__), and a storybook
  1.3 All generated components must follow these patterns:
    1.3.1 [TypeName] comes from the object type we are processing
    1.3.2 We start with [TypeName] = ApiConfig in src/types/api.types.ts
    1.3.3 We name Dialogs as [TypeName]Dialog
    1.3.4 We name Forms as [TypeName]Form
    1.3.5 We name Tables as [ArrayName]Table
    1.3.6 We name Inputs as [FieldName]Input

2. Data Management
  2.1 ApiConfig data structures are held in a store under the ID of the ApiConfig
  2.2 When the user opens the initial form, via the appropriate TAB, the data from store is displayed in the form, as read-only
  2.3 The initial form (for ApiConfig) has an "Edit" button top right
  2.4 When Edit is pressed, a deep copy of the data is taken and used in the forms/tables
  2.5 If the application closes without a save, this deep copy is lost
  2.6 When the form becomes editable, it has Save and Cancel buttons
  2.7 Save/Cancel buttons start disabled but become enabled when any field is changed

3. Field Types
  3.1 Primitive Fields:
    3.1.1 string fields become text inputs
    3.1.2 limited string fields (those with a limited set of values) become dropdowns
    3.1.3 Large string values use a textarea
    3.1.4 number fields become text fields (dropdown if values are limited)
    3.1.5 Number fields with min/max constraints use range inputs where appropriate
    3.1.6 boolean fields become toggle switches
    3.1.7 date/time fields open appropriate pickers
    3.1.8 Fields with validation show validation messages
    3.1.9 readonly fields display plain text values
    3.1.10 URL/email fields use specialized inputs with built-in validation

4. Complex Objects
  4.1 Each complex object gets a configuration button
  4.2 The [TypeName] becomes the appropriate type in the array declaration
  4.3 Buttons use an Icon and title
  4.4 For each complex type, create:
    4.4.1 [TypeName]Dialog
    4.4.2 [TypeName]Form enclosed in the dialog
    4.4.3 Form uses TanStackTable
  4.5 Button opens dialog, background goes yellow if values change
  4.6 Dialogs track changes locally until saved
  4.7 Saved changes propagate to parent

5. Arrays
  5.1 Arrays become tables
  5.2 Tables allow viewing/editing individual items
  5.3 Generate tables using TanStackTable with these rules:
    5.3.1 Primitive Fields editable in place by double click
    5.3.2 Complex Types open modal dialogs
    5.3.3 Arrays create nested modal dialogs with tables
  5.4 Name array table components as [ArrayName]Table

6. Naming Conventions
  6.1 Use BEM naming convention for CSS classes:
    6.1.1 .config-button--[type]
    6.1.2 .dialog--[type]
    6.1.3 .table--[array-type]

7. Form Behavior:
  8.1 Only dirty fields trigger updates
  8.2 Save passes updated object to parent
  8.3 Cancel resets to original values
