import type { ApiConfig } from '../types/api.types';

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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'description', type: 'string', required: false },
          { name: 'price', type: 'number', required: true },
          { name: 'stock', type: 'number', required: true },
          { 
            name: 'categories', 
            type: 'array',
            required: false,
            items: { 
              name: 'category',
              type: 'string',
              required: false
            }
          },
          { 
            name: 'images', 
            type: 'array',
            required: false,
            items: { 
              name: 'image',
              type: 'string',
              required: false
            }
          },
          { name: 'createdAt', type: 'datetime', required: true },
          { name: 'updatedAt', type: 'datetime', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'productId', type: 'string', required: true },
          { name: 'userId', type: 'string', required: true },
          { name: 'rating', type: 'number', required: true },
          { name: 'comment', type: 'string', required: false },
          { name: 'createdAt', type: 'datetime', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'string', required: true },
          { name: 'createdAt', type: 'datetime', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'price', type: 'number', required: true },
          { name: 'category', type: 'string', required: false }
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
            rules: [
              {
                resource: 'orders',
                action: ['read'],
                condition: 'user.role === "user"'
              },
              {
                resource: 'orders',
                action: ['create', 'read', 'update', 'delete'],
                condition: 'user.role === "admin"'
              }
            ]
          }
        ]
      },
    },
    entities: [
      {
        name: 'Order',
        attributes: [
          { name: 'id', type: 'string', required: true },
          { name: 'userId', type: 'string', required: true },
          { name: 'productId', type: 'string', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'status', type: 'string', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'location', type: 'string', required: true },
          { name: 'capacity', type: 'number', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'warehouseId', type: 'string', required: true },
          { name: 'lastStocked', type: 'datetime', required: false }
        ],
        endpoints: [
          { method: 'GET', path: '/items', description: 'List all inventory items' },
          { method: 'POST', path: '/items', description: 'Create a new inventory item' },
          { method: 'GET', path: '/items/:id', description: 'Get item details' },
          { method: 'PATCH', path: '/items/:id/stock', description: 'Update item stock' }
        ]
      }
    ],
  },
  {
    id: 'demo-999',
    name: 'Demo Data (can be removed)',
    version: '1.0.0',
    description: 'Sample data for development purposes',
    security: {
      authentication: {
        type: 'none'
      }
    },
    dataSources: [{
      name: 'main_db',
      type: 'postgres',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'demo_db',
        username: 'demo_user',
        password: 'demo_pass'
      }
    }],
    entities: [
      {
        name: 'Customer',
        attributes: [
          { name: 'id', type: 'string', required: true },
          { name: 'firstName', type: 'string', required: true },
          { name: 'lastName', type: 'string', required: true },
          { name: 'email', type: 'string', required: true },
          { name: 'phone', type: 'string', required: false },
          { name: 'address', type: 'string', required: false }
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
          { name: 'id', type: 'string', required: true },
          { name: 'customerId', type: 'string', required: true },
          { name: 'orderDate', type: 'datetime', required: true },
          { name: 'totalAmount', type: 'number', required: true },
          { name: 'status', type: 'string', required: true }
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
          { name: 'id', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'description', type: 'string', required: false },
          { name: 'price', type: 'number', required: true },
          { name: 'stock', type: 'number', required: true }
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
  {
    id: 'demo-1000',
    name: 'Extended Demo Data',
    version: '1.1.0',
    description: 'Additional sample data with more complex relationships',
    security: {
      authentication: {
        type: 'jwt',
        jwt: {
          secret: 'demo-secret',
          expiresIn: '1h'
        }
      }
    },
    dataSources: [{
      name: 'mongo_db',
      type: 'mongodb',
      config: {
        host: 'localhost',
        port: 27017,
        username: 'demo_user',
        password: 'demo_pass',
        database: 'extended_demo',
        tls: false
      }
    }],
    entities: [
      {
        name: 'BlogPost',
        attributes: [
          { name: 'id', type: 'string', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'content', type: 'string', required: true },
          { name: 'authorId', type: 'string', required: true },
          { name: 'publishedAt', type: 'datetime', required: false },
          { name: 'tags', type: 'array', items: { name: 'tag', type: 'string' }, required: false }
        ],
        endpoints: [
          { method: 'GET', path: '/posts', description: 'List all blog posts' },
          { method: 'POST', path: '/posts', description: 'Create new blog post' },
          { method: 'GET', path: '/posts/:id', description: 'Get blog post details' },
          { method: 'PUT', path: '/posts/:id', description: 'Update blog post' },
          { method: 'DELETE', path: '/posts/:id', description: 'Delete blog post' }
        ],
        relationships: [
          {
            name: 'author',
            type: 'many-to-one',
            source: 'BlogPost',
            target: 'User',
            description: 'Post belongs to an author',
            through: 'authorId'
          },
          {
            name: 'comments',
            type: 'one-to-many',
            source: 'BlogPost',
            target: 'Comment',
            description: 'Post can have many comments',
            through: 'postId'
          }
        ]
      },
      {
        name: 'Comment',
        attributes: [
          { name: 'id', type: 'string', required: true },
          { name: 'postId', type: 'string', required: true },
          { name: 'authorId', type: 'string', required: true },
          { name: 'content', type: 'string', required: true },
          { name: 'createdAt', type: 'datetime', required: true }
        ],
        endpoints: [
          { method: 'GET', path: '/posts/:postId/comments', description: 'Get post comments' },
          { method: 'POST', path: '/posts/:postId/comments', description: 'Add comment' },
          { method: 'DELETE', path: '/comments/:id', description: 'Delete comment' }
        ],
        relationships: [
          {
            name: 'post',
            type: 'many-to-one',
            source: 'Comment',
            target: 'BlogPost',
            description: 'Comment belongs to a post',
            through: 'postId'
          },
          {
            name: 'author',
            type: 'many-to-one',
            source: 'Comment',
            target: 'User',
            description: 'Comment belongs to an author',
            through: 'authorId'
          }
        ]
      }
    ]
  }
];
