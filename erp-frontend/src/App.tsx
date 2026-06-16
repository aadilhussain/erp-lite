import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import './App.css'

type ModuleKey =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'customers'
  | 'products'
  | 'proposals'

type UserEntry = {
  id: number
  name: string
  email: string
  role: string
}

type RoleEntry = {
  id: number
  role: string
  permissions: string
}

type Customer = {
  id: number
  name: string
  company: string
  email: string
  phone: string
}

type Product = {
  id: number
  name: string
  sku: string
  stock: number
  price: number
  status: 'Active' | 'Paused'
}

type Proposal = {
  id: number
  title: string
  customer: string
  amount: number
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected'
}

type UserFormState = Omit<UserEntry, 'id'>
type RoleFormState = Omit<RoleEntry, 'id'>
type CustomerFormState = Omit<Customer, 'id'>
type ProductFormState = {
  name: string
  sku: string
  stock: string
  price: string
  status: Product['status']
}
type ProposalFormState = {
  title: string
  customer: string
  amount: string
  status: Proposal['status']
}

const modules: { key: ModuleKey; label: string; short: string }[] = [
  { key: 'dashboard', label: 'Dashboard', short: 'DB' },
  { key: 'users', label: 'Users', short: 'US' },
  { key: 'roles', label: 'Roles & Permissions', short: 'RP' },
  { key: 'customers', label: 'Customers', short: 'CU' },
  { key: 'products', label: 'Products', short: 'PR' },
  { key: 'proposals', label: 'Proposals', short: 'PO' },
]

const initialUsers: UserEntry[] = [
  { id: 1, name: 'Admin User', email: 'admin@erplite.test', role: 'Admin' },
  { id: 2, name: 'Sales Manager', email: 'sales@erplite.test', role: 'Sales' },
  { id: 3, name: 'Inventory Clerk', email: 'stock@erplite.test', role: 'Inventory' },
]

const initialRoles: RoleEntry[] = [
  { id: 1, role: 'Admin', permissions: 'All modules, user management, settings' },
  { id: 2, role: 'Sales', permissions: 'Customers, proposals, dashboard' },
  { id: 3, role: 'Inventory', permissions: 'Products, stock updates, dashboard' },
]

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Aarav Sharma',
    company: 'Northstar Retail',
    email: 'aarav@northstar.test',
    phone: '+91 98765 43210',
  },
  {
    id: 2,
    name: 'Meera Kapoor',
    company: 'Urban Supply Co.',
    email: 'meera@urban.test',
    phone: '+91 99887 77665',
  },
  {
    id: 3,
    name: 'Rohan Shah',
    company: 'Bluefin Services',
    email: 'rohan@bluefin.test',
    phone: '+91 91234 56780',
  },
]

const initialProducts: Product[] = [
  { id: 1, name: 'Office Desk', sku: 'DESK-100', stock: 18, price: 12999, status: 'Active' },
  { id: 2, name: 'Ergo Chair', sku: 'CHR-220', stock: 7, price: 8999, status: 'Active' },
  { id: 3, name: 'Storage Cabinet', sku: 'CAB-080', stock: 3, price: 5999, status: 'Paused' },
]

const initialProposals: Proposal[] = [
  { id: 1, title: 'Retail furniture refresh', customer: 'Northstar Retail', amount: 148500, status: 'Sent' },
  { id: 2, title: 'Warehouse seating order', customer: 'Urban Supply Co.', amount: 72500, status: 'Draft' },
  { id: 3, title: 'Front office setup', customer: 'Bluefin Services', amount: 210000, status: 'Accepted' },
]

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f6f5b' },
    secondary: { main: '#7551a6' },
    background: { default: '#f6f7f4', paper: '#ffffff' },
    text: { primary: '#17211d', secondary: '#65716b' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function getNextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const [users, setUsers] = useState(initialUsers)
  const [roles, setRoles] = useState(initialRoles)
  const [customers, setCustomers] = useState(initialCustomers)
  const [products, setProducts] = useState(initialProducts)
  const [proposals, setProposals] = useState(initialProposals)

  const dashboard = useMemo(() => {
    const revenue = proposals
      .filter((proposal) => proposal.status === 'Accepted')
      .reduce((total, proposal) => total + proposal.amount, 0)
    const pipeline = proposals.reduce((total, proposal) => total + proposal.amount, 0)
    const lowStock = products.filter((product) => product.stock <= 5).length

    return { revenue, pipeline, lowStock }
  }, [products, proposals])

  const addUser = (user: UserFormState) => {
    setUsers([{ id: getNextId(users), ...user }, ...users])
  }

  const addRole = (role: RoleFormState) => {
    setRoles([{ id: getNextId(roles), ...role }, ...roles])
  }

  const addCustomer = (customer: CustomerFormState) => {
    setCustomers([{ id: getNextId(customers), ...customer }, ...customers])
  }

  const addProduct = (product: ProductFormState) => {
    setProducts([
      {
        id: getNextId(products),
        name: product.name,
        sku: product.sku,
        stock: Number(product.stock),
        price: Number(product.price),
        status: product.status,
      },
      ...products,
    ])
  }

  const addProposal = (proposal: ProposalFormState) => {
    setProposals([
      {
        id: getNextId(proposals),
        title: proposal.title,
        customer: proposal.customer,
        amount: Number(proposal.amount),
        status: proposal.status,
      },
      ...proposals,
    ])
  }

  const exportData = () => {
    const data = { users, roles, customers, products, proposals }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'erp-lite-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Drawer
          variant="permanent"
          slotProps={{ paper: { className: 'sidebar' } }}
        >
          <Stack spacing={3} className="brand">
            <Avatar className="brand-mark">EL</Avatar>
            <Box>
              <Typography variant="h6">ERP Lite</Typography>
              <Typography variant="body2" color="text.secondary">
                Sales and inventory
              </Typography>
            </Box>
          </Stack>

          <List className="nav-list">
            {modules.map((module) => (
              <ListItemButton
                key={module.key}
                selected={activeModule === module.key}
                onClick={() => setActiveModule(module.key)}
              >
                <Avatar className="nav-avatar">{module.short}</Avatar>
                <ListItemText primary={module.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        <Box component="main" className="main-content">
          <AppBar position="sticky" color="inherit" elevation={0} className="topbar">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4">ERP Lite</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage users, customers, products, proposals, and permissions
                </Typography>
              </Box>
              <Chip label="Local entries enabled" color="primary" variant="outlined" />
            </Toolbar>
          </AppBar>

          <Box className="mobile-tabs">
            <Tabs
              value={activeModule}
              onChange={(_, value: ModuleKey) => setActiveModule(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {modules.map((module) => (
                <Tab key={module.key} label={module.label} value={module.key} />
              ))}
            </Tabs>
          </Box>

          <Box className="page">
            {activeModule === 'dashboard' && (
              <Dashboard
                customerCount={customers.length}
                productCount={products.length}
                proposalCount={proposals.length}
                pipeline={dashboard.pipeline}
                revenue={dashboard.revenue}
                lowStock={dashboard.lowStock}
                onExport={exportData}
              />
            )}

            {activeModule === 'users' && (
              <UsersView users={users} roles={roles} onAddUser={addUser} />
            )}
            {activeModule === 'roles' && (
              <RolesView roles={roles} onAddRole={addRole} />
            )}
            {activeModule === 'customers' && (
              <CustomersView customers={customers} onAddCustomer={addCustomer} />
            )}
            {activeModule === 'products' && (
              <ProductsView products={products} onAddProduct={addProduct} />
            )}
            {activeModule === 'proposals' && (
              <ProposalsView
                customers={customers}
                proposals={proposals}
                onAddProposal={addProposal}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function Dashboard(props: {
  customerCount: number
  productCount: number
  proposalCount: number
  pipeline: number
  revenue: number
  lowStock: number
  onExport: () => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle
        title="Dashboard"
        action={<Button variant="contained" onClick={props.onExport}>Export</Button>}
      />
      <Grid container spacing={2}>
        <StatCard label="Customers" value={props.customerCount} helper="Active accounts" />
        <StatCard label="Products" value={props.productCount} helper={`${props.lowStock} low stock`} />
        <StatCard label="Proposals" value={props.proposalCount} helper="Open sales work" />
        <StatCard label="Pipeline" value={currency.format(props.pipeline)} helper="Total proposal value" />
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper className="panel">
            <Typography variant="h6">Monthly Target</Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted revenue: {currency.format(props.revenue)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((props.revenue / 300000) * 100, 100)}
              sx={{ mt: 3, height: 10, borderRadius: 8 }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper className="panel accent-panel">
            <Typography variant="h6">Next Action</Typography>
            <Typography color="text.secondary">
              Follow up on sent proposals and reorder products below minimum stock.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}

function UsersView(props: {
  users: UserEntry[]
  roles: RoleEntry[]
  onAddUser: (user: UserFormState) => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Users" action={<Chip label={`${props.users.length} users`} />} />
      <UserForm roles={props.roles} onAddUser={props.onAddUser} />
      <DataTable
        headers={['Name', 'Email', 'Role']}
        rows={props.users.map((user) => [user.name, user.email, user.role])}
      />
    </Stack>
  )
}

function UserForm(props: {
  roles: RoleEntry[]
  onAddUser: (user: UserFormState) => void
}) {
  const [form, setForm] = useState<UserFormState>({
    name: '',
    email: '',
    role: props.roles[0]?.role ?? 'Admin',
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const role = String(data.get('role') ?? form.role)

    if (!name || !email) return
    props.onAddUser({
      name,
      email,
      role,
    })
    setForm({ name: '', email: '', role: props.roles[0]?.role ?? 'Admin' })
  }

  return (
    <Paper className="panel" component="form" onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            size="small"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            size="small"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              {props.roles.map((role) => (
                <MenuItem key={role.id} value={role.role}>{role.role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button fullWidth type="submit" variant="contained">Invite User</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function RolesView(props: {
  roles: RoleEntry[]
  onAddRole: (role: RoleFormState) => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Roles & Permissions" action={<Chip label={`${props.roles.length} roles`} />} />
      <RoleForm onAddRole={props.onAddRole} />
      <DataTable
        headers={['Role', 'Permissions']}
        rows={props.roles.map((row) => [row.role, row.permissions])}
      />
    </Stack>
  )
}

function RoleForm(props: { onAddRole: (role: RoleFormState) => void }) {
  const [form, setForm] = useState<RoleFormState>({
    role: '',
    permissions: '',
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const role = String(data.get('role') ?? '').trim()
    const permissions = String(data.get('permissions') ?? '').trim()

    if (!role || !permissions) return
    props.onAddRole({
      role,
      permissions,
    })
    setForm({ role: '', permissions: '' })
  }

  return (
    <Paper className="panel" component="form" onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Role name"
            name="role"
            size="small"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <TextField
            required
            fullWidth
            label="Permissions"
            name="permissions"
            size="small"
            value={form.permissions}
            onChange={(event) => setForm({ ...form, permissions: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button fullWidth type="submit" variant="contained">Add Role</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function CustomersView(props: {
  customers: Customer[]
  onAddCustomer: (customer: CustomerFormState) => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Customers" action={<Chip label={`${props.customers.length} customers`} />} />
      <CustomerForm onAddCustomer={props.onAddCustomer} />
      <DataTable
        headers={['Name', 'Company', 'Email', 'Phone']}
        rows={props.customers.map((customer) => [
          customer.name,
          customer.company,
          customer.email,
          customer.phone,
        ])}
      />
    </Stack>
  )
}

function CustomerForm(props: {
  onAddCustomer: (customer: CustomerFormState) => void
}) {
  const [form, setForm] = useState<CustomerFormState>({
    name: '',
    company: '',
    email: '',
    phone: '',
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const company = String(data.get('company') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()

    if (!name || !company || !email) return
    props.onAddCustomer({
      name,
      company,
      email,
      phone,
    })
    setForm({ name: '', company: '', email: '', phone: '' })
  }

  return (
    <Paper className="panel" component="form" onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            size="small"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Company"
            name="company"
            size="small"
            value={form.company}
            onChange={(event) => setForm({ ...form, company: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            size="small"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            size="small"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained">Save Customer</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function ProductsView(props: {
  products: Product[]
  onAddProduct: (product: ProductFormState) => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Products" action={<Chip label={`${props.products.length} products`} />} />
      <ProductForm onAddProduct={props.onAddProduct} />
      <DataTable
        headers={['Name', 'SKU', 'Stock', 'Price', 'Status']}
        rows={props.products.map((product) => [
          product.name,
          product.sku,
          product.stock,
          currency.format(product.price),
          <StatusChip key={product.id} status={product.status} />,
        ])}
      />
    </Stack>
  )
}

function ProductForm(props: {
  onAddProduct: (product: ProductFormState) => void
}) {
  const [form, setForm] = useState<ProductFormState>({
    name: '',
    sku: '',
    price: '',
    stock: '',
    status: 'Active',
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const product: ProductFormState = {
      name: String(data.get('name') ?? '').trim(),
      sku: String(data.get('sku') ?? '').trim(),
      price: String(data.get('price') ?? ''),
      stock: String(data.get('stock') ?? ''),
      status: String(data.get('status') ?? form.status) as Product['status'],
    }

    if (!product.name || !product.sku || !product.price || !product.stock) return
    props.onAddProduct(product)
    setForm({ name: '', sku: '', price: '', stock: '', status: 'Active' })
  }

  return (
    <Paper className="panel" component="form" onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            size="small"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            required
            fullWidth
            label="SKU"
            name="sku"
            size="small"
            value={form.sku}
            onChange={(event) => setForm({ ...form, sku: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            required
            fullWidth
            label="Price"
            name="price"
            size="small"
            type="number"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            required
            fullWidth
            label="Stock"
            name="stock"
            size="small"
            type="number"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as Product['status'] })}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <Button fullWidth type="submit" variant="contained">Save</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function ProposalsView(props: {
  customers: Customer[]
  proposals: Proposal[]
  onAddProposal: (proposal: ProposalFormState) => void
}) {
  return (
    <Stack spacing={3}>
      <SectionTitle title="Proposals" action={<Chip label={`${props.proposals.length} proposals`} />} />
      <ProposalForm customers={props.customers} onAddProposal={props.onAddProposal} />
      <DataTable
        headers={['Title', 'Customer', 'Amount', 'Status']}
        rows={props.proposals.map((proposal) => [
          proposal.title,
          proposal.customer,
          currency.format(proposal.amount),
          <StatusChip key={proposal.id} status={proposal.status} />,
        ])}
      />
    </Stack>
  )
}

function ProposalForm(props: {
  customers: Customer[]
  onAddProposal: (proposal: ProposalFormState) => void
}) {
  const firstCustomer = props.customers[0]?.company ?? ''
  const [form, setForm] = useState<ProposalFormState>({
    title: '',
    customer: firstCustomer,
    amount: '',
    status: 'Draft',
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const proposal: ProposalFormState = {
      title: String(data.get('title') ?? '').trim(),
      customer: String(data.get('customer') ?? form.customer),
      amount: String(data.get('amount') ?? ''),
      status: String(data.get('status') ?? form.status) as Proposal['status'],
    }

    if (!proposal.title || !proposal.customer || !proposal.amount) return
    props.onAddProposal({
      title: proposal.title,
      customer: proposal.customer,
      amount: proposal.amount,
      status: proposal.status,
    })
    setForm({ title: '', customer: firstCustomer, amount: '', status: 'Draft' })
  }

  return (
    <Paper className="panel" component="form" onSubmit={submit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            required
            fullWidth
            label="Proposal title"
            name="title"
            size="small"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Customer</InputLabel>
            <Select
              label="Customer"
              name="customer"
              value={form.customer}
              onChange={(event) => setForm({ ...form, customer: event.target.value })}
            >
              {props.customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.company}>{customer.company}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            required
            fullWidth
            label="Amount"
            name="amount"
            size="small"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as Proposal['status'] })}
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button fullWidth type="submit" variant="contained">Save</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function SectionTitle(props: { title: string; action: ReactNode }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {props.title}
        </Typography>
        <Typography color="text.secondary">ERP Lite / {props.title}</Typography>
      </Box>
      {props.action}
    </Stack>
  )
}

function StatCard(props: { label: string; value: string | number; helper: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Paper className="stat-card">
        <Typography color="text.secondary">{props.label}</Typography>
        <Typography variant="h4">{props.value}</Typography>
        <Typography variant="body2" color="text.secondary">{props.helper}</Typography>
      </Paper>
    </Grid>
  )
}

function DataTable(props: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <TableContainer component={Paper} className="table-panel">
      <Table>
        <TableHead>
          <TableRow>
            {props.headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {row.map((cell, cellIndex) => (
                <TableCell key={`${rowIndex}-${cellIndex}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function StatusChip(props: { status: string }) {
  const color = props.status === 'Accepted' || props.status === 'Active' ? 'success' : 'default'

  return <Chip size="small" label={props.status} color={color} variant="outlined" />
}

export default App
