import type { ApiConfig } from '../types/all.types';

/**
 * Development-only demo data that will be automatically loaded in development mode.
 * This data is excluded from production builds.
 */
export const demoStore: ApiConfig[] = [
  // E-commerce API
  {
    id: 'ecom-1',
    name: 'E-Commerce API',
    version: '2.3.0',
    description: 'Full e-commerce platform API',
    basePath: '/api/ecom',
    environment: 'development',
    deployment: {
      provider: 'docker',
      settings: {}
    },
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-04-10T14:25:00Z',
    security: {
      authentication: {
        type: 'jwt',
        jwt: {
          secret: 'ecom-secret-123',
          expiresIn: '24h'
        }
      },
      authorization: {
        roles: [
          {
            name: 'admin',
            description: 'Full access',
            permissions: ['*']
          },
          {
            name: 'customer',
            description: 'Customer access',
            permissions: ['read:self', 'update:self']
          }
        ]
      }
    },
    entities: [
      {
        name: 'Product',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique product identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'Product name' },
          { id: 'description', name: 'description', type: 'string', required: false, description: 'Detailed product description' },
          { id: 'price', name: 'price', type: 'number', required: true, description: 'Product price in USD' },
          { id: 'stock', name: 'stock', type: 'number', required: true, description: 'Current inventory quantity' },
          { 
            id: 'categories',
            name: 'categories', 
            type: 'array',
            required: false,
            description: 'Product categories',
            items: { 
              id: 'category',
              name: 'category',
              type: 'string',
              required: false,
              description: 'Individual category name'
            }
          },
          { 
            id: 'images',
            name: 'images', 
            type: 'array',
            required: false,
            description: 'Product images',
            items: { 
              id: 'image',
              name: 'image',
              type: 'string',
              required: false,
              description: 'Image URL'
            }
          },
          { id: 'createdAt', name: 'createdAt', type: 'datetime', required: true, description: 'Creation timestamp' },
          { id: 'updatedAt', name: 'updatedAt', type: 'datetime', required: true, description: 'Last update timestamp' }
        ],
        endpoints: [
          { method: 'GET', path: '/products', description: 'List all products' },
          { method: 'POST', path: '/products', description: 'Create new product' },
          { method: 'GET', path: '/products/:id', description: 'Get product details' },
          { method: 'PUT', path: '/products/:id', description: 'Update product' },
          { method: 'DELETE', path: '/products/:id', description: 'Delete product' },
          { method: 'GET', path: '/products/search', description: 'Search products' }
        ],
        relationships: [
          {
            name: 'reviews',
            type: 'one-to-many',
            source: 'Product',
            target: 'Review',
            description: 'Product can have many reviews',
            through: 'productId'
          }
        ]
      },
      {
        name: 'Review',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique review identifier' },
          { id: 'productId', name: 'productId', type: 'string', required: true, description: 'Reviewed product ID' },
          { id: 'userId', name: 'userId', type: 'string', required: true, description: 'Review author ID' },
          { id: 'rating', name: 'rating', type: 'number', required: true, description: 'Rating (1-5)' },
          { id: 'comment', name: 'comment', type: 'string', required: false, description: 'Review text content' },
          { id: 'createdAt', name: 'createdAt', type: 'datetime', required: true, description: 'Review creation timestamp' }
        ],
        endpoints: [
          { method: 'GET', path: '/products/:productId/reviews', description: 'Get product reviews' },
          { method: 'POST', path: '/products/:productId/reviews', description: 'Create review' },
          { method: 'DELETE', path: '/reviews/:id', description: 'Delete review' }
        ],
        relationships: [
          {
            name: 'product',
            type: 'many-to-one',
            source: 'Review',
            target: 'Product',
            description: 'Review belongs to a product',
            through: 'productId'
          },
          {
            name: 'user',
            type: 'many-to-one',
            source: 'Review',
            target: 'User',
            description: 'Review belongs to a user',
            through: 'userId'
          }
        ]
      }
    ]
  },
  {
    id: '1',
    name: 'User API',
    version: '1.0.0',
    description: 'API for managing users',
    basePath: '/api/users',
    environment: 'development',
    deployment: {
      provider: 'docker',
      settings: {}
    },
    createdAt: '2023-11-20T08:15:00Z',
    updatedAt: '2024-03-05T11:40:00Z',
    security: {
      authentication: {
        type: 'jwt',
        jwt: {
          secret: 'your-secret-key',
          expiresIn: '1h'
        }
      },
      authorization: {
        roles: [
          {
            name: 'admin',
            description: 'Administrator role',
            permissions: ['create', 'read', 'update', 'delete']
          },
          {
            name: 'user',
            description: 'Regular user role',
            permissions: ['read']
          }
        ]
      },
    },
    entities: [
      {
        name: 'User',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique user identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'User full name' },
          { id: 'email', name: 'email', type: 'string', required: true, description: 'User email address' },
          { id: 'createdAt', name: 'createdAt', type: 'datetime', required: true, description: 'Account creation timestamp' }
        ],
        endpoints: [
          { method: 'GET', path: '/users', description: 'List all users' },
          { method: 'POST', path: '/users', description: 'Create a new user' },
          { method: 'GET', path: '/users/:id', description: 'Get a user by ID' }
        ]
      },
      {
        name: 'Product',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique product identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'Product name' },
          { id: 'price', name: 'price', type: 'number', required: true, description: 'Product price' },
          { id: 'category', name: 'category', type: 'string', required: false, description: 'Product category' }
        ],
        endpoints: [
          { method: 'GET', path: '/products', description: 'List all products' },
          { method: 'POST', path: '/products', description: 'Create a new product' },
          { method: 'GET', path: '/products/:id', description: 'Get a product by ID' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Order API',
    version: '1.2.0',
    description: 'API for managing orders',
    basePath: '/api/orders',
    environment: 'development',
    deployment: {
      provider: 'docker',
      settings: {}
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-04-12T16:20:00Z',
    security: {
      authentication: {
        type: 'api-key',
        apiKey: {
          header: 'X-API-KEY'
        }
      },
      authorization: {
        policies: [
          {
            name: 'order-access',
            description: 'Policy for order operations',
            effect: 'allow',
            actions: ['read', 'create', 'update', 'delete'],
            resources: ['orders'],
            conditions: {
              'user.role': {
                operator: 'equals',
                value: 'admin'
              }
            }
          },
          {
            name: 'user-order-access',
            description: 'Policy for user order operations',
            effect: 'allow',
            actions: ['read'],
            resources: ['orders'],
            conditions: {
              'user.role': {
                operator: 'equals',
                value: 'user'
              }
            }
          }
        ]
      },
    },
    entities: [
      {
        name: 'Order',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique order identifier' },
          { id: 'userId', name: 'userId', type: 'string', required: true, description: 'Ordering user ID' },
          { id: 'productId', name: 'productId', type: 'string', required: true, description: 'Ordered product ID' },
          { id: 'quantity', name: 'quantity', type: 'number', required: true, description: 'Product quantity ordered' },
          { id: 'status', name: 'status', type: 'string', required: true, description: 'Order status (pending, completed, cancelled)' }
        ],
        endpoints: [
          { method: 'GET', path: '/orders', description: 'List all orders' },
          { method: 'POST', path: '/orders', description: 'Create a new order' },
          { method: 'GET', path: '/orders/:id', description: 'Get an order by ID' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Inventory API',
    version: '2.1.0',
    description: 'API for inventory management',
    basePath: '/api/inventory',
    environment: 'development',
    deployment: {
      provider: 'docker',
      settings: {}
    },
    createdAt: '2023-12-10T13:45:00Z',
    updatedAt: '2024-04-08T09:10:00Z',
    security: {
      authentication: {
        type: 'jwt',
        jwt: {
          secret: 'inventory-secret',
          expiresIn: '2h'
        }
      },
      authorization: {
        roles: [
          {
            name: 'manager',
            description: 'Inventory manager role',
            permissions: ['create', 'read', 'update']
          },
          {
            name: 'auditor',
            description: 'Inventory auditor role',
            permissions: ['read']
          }
        ]
      }
    },
    entities: [
      {
        name: 'Warehouse',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique warehouse identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'Warehouse name' },
          { id: 'location', name: 'location', type: 'string', required: true, description: 'Warehouse physical location' },
          { id: 'capacity', name: 'capacity', type: 'number', required: true, description: 'Total storage capacity in cubic meters' }
        ],
        endpoints: [
          { method: 'GET', path: '/warehouses', description: 'List all warehouses' },
          { method: 'POST', path: '/warehouses', description: 'Create a new warehouse' },
          { method: 'GET', path: '/warehouses/:id', description: 'Get warehouse details' }
        ]
      },
      {
        name: 'InventoryItem',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique item identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'Item name' },
          { id: 'quantity', name: 'quantity', type: 'number', required: true, description: 'Current stock quantity' },
          { id: 'warehouseId', name: 'warehouseId', type: 'string', required: true, description: 'Warehouse location ID' },
          { id: 'lastStocked', name: 'lastStocked', type: 'datetime', required: false, description: 'Last restock timestamp' }
        ],
        endpoints: [
          { method: 'GET', path: '/items', description: 'List all inventory items' },
          { method: 'POST', path: '/items', description: 'Create a new inventory item' },
          { method: 'GET', path: '/items/:id', description: 'Get item details' },
          { method: 'PATCH', path: '/items/:id/stock', description: 'Update item stock' }
        ]
      }
    ]
  },
  {
    id: 'demo-999',
    name: 'Demo Data (can be removed)',
    version: '1.0.0',
    description: 'Sample data for development purposes',
    basePath: '/api/demo',
    environment: 'development',
    deployment: {
      provider: 'docker',
      settings: {}
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-04-15T12:00:00Z',
    security: {
      authentication: {
        type: 'none'
      }
    },
    entities: [
      {
        name: 'Customer',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique customer identifier' },
          { id: 'firstName', name: 'firstName', type: 'string', required: true, description: 'Customer first name' },
          { id: 'lastName', name: 'lastName', type: 'string', required: true, description: 'Customer last name' },
          { id: 'email', name: 'email', type: 'string', required: true, description: 'Customer email address' },
          { id: 'phone', name: 'phone', type: 'string', required: false, description: 'Customer phone number' },
          { id: 'address', name: 'address', type: 'string', required: false, description: 'Customer physical address' }
        ],
        endpoints: [
          { method: 'GET', path: '/customers', description: 'List customers' },
          { method: 'POST', path: '/customers', description: 'Create customer' },
          { method: 'GET', path: '/customers/:id', description: 'Get customer' }
        ],
        relationships: [
          {
            name: 'orders',
            type: 'one-to-many',
            source: 'Customer',
            target: 'Order',
            description: 'Customer can have many orders',
            through: 'customerId'
          },
          {
            name: 'addresses',
            type: 'one-to-many',
            source: 'Customer',
            target: 'Address',
            description: 'Customer can have multiple addresses',
            through: 'customerId'
          }
        ]
      },
      {
        name: 'Order',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique order identifier' },
          { id: 'customerId', name: 'customerId', type: 'string', required: true, description: 'Customer who placed the order' },
          { id: 'orderDate', name: 'orderDate', type: 'datetime', required: true, description: 'Order creation timestamp' },
          { id: 'totalAmount', name: 'totalAmount', type: 'number', required: true, description: 'Total order amount' },
          { id: 'status', name: 'status', type: 'string', required: true, description: 'Order status (pending, shipped, delivered)' }
        ],
        endpoints: [
          { method: 'GET', path: '/orders', description: 'List orders' },
          { method: 'POST', path: '/orders', description: 'Create order' },
          { method: 'GET', path: '/orders/:id', description: 'Get order' }
        ],
        relationships: [
          {
            name: 'customer',
            type: 'many-to-one',
            source: 'Order',
            target: 'Customer',
            description: 'Order belongs to a customer',
            through: 'customerId'
          },
          {
            name: 'products',
            type: 'many-to-many',
            source: 'Order',
            target: 'Product',
            description: 'Order contains multiple products',
            through: 'OrderItem'
          },
          {
            name: 'payments',
            type: 'one-to-many',
            source: 'Order',
            target: 'Payment',
            description: 'Order can have multiple payments',
            through: 'orderId'
          }
        ]
      },
      {
        name: 'Product',
        attributes: [
          { id: 'id', name: 'id', type: 'string', required: true, description: 'Unique product identifier' },
          { id: 'name', name: 'name', type: 'string', required: true, description: 'Product name' },
          { id: 'description', name: 'description', type: 'string', required: false, description: 'Product description' },
          { id: 'price', name: 'price', type: 'number', required: true, description: 'Product price' },
          { id: 'stock', name: 'stock', type: 'number', required: true, description: 'Current inventory count' }
        ],
        endpoints: [
          { method: 'GET', path: '/products', description: 'List products' },
          { method: 'POST', path: '/products', description: 'Create product' },
          { method: 'GET', path: '/products/:id', description: 'Get product' }
        ],
        relationships: [
          {
            name: 'orders',
            type: 'many-to-many',
            source: 'Product',
            target: 'Order',
            description: 'Product can be in many orders',
            through: 'OrderItem'
          },
          {
            name: 'categories',
            type: 'many-to-many',
            source: 'Product',
            target: 'Category',
            description: 'Product can belong to multiple categories',
            through: 'ProductCategory'
          },
          {
            name: 'supplier',
            type: 'many-to-one',
            source: 'Product',
            target: 'Supplier',
            description: 'Product supplied by a supplier',
            through: 'supplierId'
          }
        ]
      }
    ]
  },
];
