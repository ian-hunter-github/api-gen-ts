import { Meta, StoryObj } from '@storybook/react';
import { TanStackTable } from './TanStackTable';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { CellContext } from '@tanstack/react-table';

type Person = {
  id: string;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  roles: string[];
  bio: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    timezone: string;
  };
  actions?: {
    openDialog: (id: string) => void;
  };
};

const meta: Meta<typeof TanStackTable> = {
  title: 'Components/TanStackTable',
  component: TanStackTable,
  tags: ['autodocs'],
};

export default meta;

// Simple table example
export const SimpleTable: StoryObj<typeof TanStackTable<Person>> = {
  args: {
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Status', accessorKey: 'status' }
    ],
    data: [
      {
        id: '1',
        name: 'John Doe',
        age: 32,
        email: 'john@example.com',
        status: 'active',
        lastLogin: '2025-04-15T10:30:00Z',
        roles: ['admin', 'user'],
        bio: 'Software developer with 5 years of experience',
        avatar: '',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          timezone: 'UTC+1'
        },
        actions: {
          openDialog: (id) => console.log(`Opening dialog for user ${id}`)
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 28,
        email: 'jane@example.com',
        status: 'inactive',
        lastLogin: '2025-04-10T15:45:00Z',
        roles: ['user'],
        bio: 'UX designer passionate about accessibility',
        avatar: '',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zip: '67890'
        },
        preferences: {
          theme: 'light',
          notifications: false,
          timezone: 'UTC-5'
        },
        actions: {
          openDialog: (id) => console.log(`Opening dialog for user ${id}`)
        }
      }
    ]
  }
};

// Complex table with all features
export const ComplexTable: StoryObj<typeof TanStackTable<Person>> = {
  args: {
    columns: [
      { 
        header: 'Name', 
        accessorKey: 'name',
        cell: (info: CellContext<Person, unknown>) => <strong>{info.getValue<string>()}</strong>
      },
      { 
        header: 'Age', 
        accessorKey: 'age',
        cell: (info: CellContext<Person, unknown>) => `${info.getValue<number>()} years`
      },
      { 
        header: 'Email', 
        accessorKey: 'email',
        cell: (info: CellContext<Person, unknown>) => <a href={`mailto:${info.getValue<string>()}`}>{info.getValue<string>()}</a>
      },
      { 
        header: 'Status', 
        accessorKey: 'status',
        cellType: 'dropdown',
        cellOptions: {
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' }
          ],
          onChange: (value) => console.log('Status changed to:', value)
        },
        cell: (info: CellContext<Person, unknown>) => {
          const status = info.getValue<'active' | 'inactive' | 'pending'>();
          const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange';
          return (
            <select
              value={status}
              onChange={(e) => {
                if (info.table.options.meta?.updateData) {
                  info.table.options.meta.updateData(info.row.index, 'status', e.target.value);
                }
              }}
              style={{ 
                color,
                border: `1px solid ${color}`,
                borderRadius: '4px',
                padding: '2px 4px'
              }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          );
        }
      },
      { 
        header: 'Last Login', 
        accessorKey: 'lastLogin',
        cellType: 'datetime',
        cellOptions: {
          format: 'MM/dd/yyyy hh:mm a',
          onChange: (value) => console.log('Date changed to:', value)
        },
        cell: (info: CellContext<Person, unknown>) => (
          <input
            type="datetime-local"
            value={info.getValue<string>()}
            onChange={(e) => {
              if (info.table.options.meta?.updateData) {
                info.table.options.meta.updateData(info.row.index, 'lastLogin', e.target.value);
              }
            }}
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '2px 4px'
            }}
          />
        )
      },
      { 
        header: 'Roles', 
        accessorKey: 'roles',
        cell: (info: CellContext<Person, unknown>) => info.getValue<string[]>().join(', ')
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: (info: CellContext<Person, unknown>) => (
          <div className="table-actions" style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => info.row.original.actions?.openDialog(info.row.original.id)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => console.log(`Delete item ${info.row.original.id}`)}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    data: [
      {
        id: '1',
        name: 'John Doe',
        age: 32,
        email: 'john@example.com',
        status: 'active',
        lastLogin: '2025-04-15T10:30:00Z',
        roles: ['admin', 'user'],
        bio: 'Software developer with 5 years of experience',
        avatar: '',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          timezone: 'UTC+1'
        },
        actions: {
          openDialog: (id) => console.log(`Opening dialog for user ${id}`)
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 28,
        email: 'jane@example.com',
        status: 'inactive',
        lastLogin: '2025-04-10T15:45:00Z',
        roles: ['user'],
        bio: 'UX designer passionate about accessibility',
        avatar: '',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zip: '67890'
        },
        preferences: {
          theme: 'light',
          notifications: false,
          timezone: 'UTC-5'
        },
        actions: {
          openDialog: (id) => console.log(`Opening dialog for user ${id}`)
        }
      },
      {
        id: '3',
        name: 'Bob Johnson',
        age: 45,
        email: 'bob@example.com',
        status: 'pending',
        lastLogin: '2025-04-05T08:15:00Z',
        roles: ['manager', 'user'],
        bio: 'Product manager with 10 years of experience',
        avatar: '',
        address: {
          street: '789 Pine Rd',
          city: 'Nowhere',
          state: 'TX',
          zip: '54321'
        },
        preferences: {
          theme: 'system',
          notifications: true,
          timezone: 'UTC'
        },
        actions: {
          openDialog: (id) => console.log(`Opening dialog for user ${id}`)
        }
      }
    ],
    className: 'complex-table',
    enableSorting: true,
    enablePagination: true,
    pageSize: 2
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test sorting
    await userEvent.click(canvas.getByText('Name'));
    await expect(canvas.getByText('Bob Johnson')).toBeInTheDocument();
    
    // Test pagination
    await userEvent.click(canvas.getByLabelText('Go to next page'));
    await expect(canvas.getByText('Bob Johnson')).toBeInTheDocument();
  }
};

// Empty state table
export const EmptyTable: StoryObj<typeof TanStackTable<Person>> = {
  args: {
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' },
      { header: 'Email', accessorKey: 'email' }
    ],
    data: [],
    emptyMessage: 'No data available'
  }
};

// Loading state table
export const LoadingTable: StoryObj<typeof TanStackTable<Person>> = {
  args: {
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' },
      { header: 'Email', accessorKey: 'email' }
    ],
    data: [],
    isLoading: true
  }
};

// Table with bulk delete functionality
export const TableWithBulkDelete: StoryObj<typeof TanStackTable<Omit<Person, 'actions'>>> = {
  args: {
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Status', accessorKey: 'status' },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: (info: CellContext<Omit<Person, 'actions'>, unknown>) => (
          <button 
            className="btn btn-danger"
            onClick={() => info.table.options.meta?.onDelete?.(info.row.original)}
          >
            Delete
          </button>
        )
      }
    ],
    data: [
      {
        id: '1',
        name: 'John Doe',
        age: 32,
        email: 'john@example.com',
        status: 'active',
        lastLogin: '2025-04-15T10:30:00Z',
        roles: ['admin', 'user'],
        bio: 'Software developer with 5 years of experience',
        avatar: '',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          timezone: 'UTC+1'
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 28,
        email: 'jane@example.com',
        status: 'inactive',
        lastLogin: '2025-04-10T15:45:00Z',
        roles: ['user'],
        bio: 'UX designer passionate about accessibility',
        avatar: '',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zip: '67890'
        },
        preferences: {
          theme: 'light',
          notifications: false,
          timezone: 'UTC-5'
        }
      },
      {
        id: '3',
        name: 'Bob Johnson',
        age: 45,
        email: 'bob@example.com',
        status: 'pending',
        lastLogin: '2025-04-05T08:15:00Z',
        roles: ['manager', 'user'],
        bio: 'Product manager with 10 years of experience',
        avatar: '',
        address: {
          street: '789 Pine Rd',
          city: 'Nowhere',
          state: 'TX',
          zip: '54321'
        },
        preferences: {
          theme: 'system',
          notifications: true,
          timezone: 'UTC'
        }
      }
    ],
    enableRowSelection: true,
    onDelete: (row) => console.log('Deleted single row:', row.id),
    onBulkDelete: (rows) => console.log('Bulk deleted rows:', rows.map(r => r.id))
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Select first two rows
    const checkboxes = canvas.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]); // First data row
    await userEvent.click(checkboxes[2]); // Second data row
    
    // Click bulk delete button
    await userEvent.click(canvas.getByText('Delete Selected'));
    
    // Verify console output would show bulk delete
  }
};
