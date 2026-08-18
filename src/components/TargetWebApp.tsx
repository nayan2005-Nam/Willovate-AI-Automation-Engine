import React, { useState } from 'react';
import {
  Users,
  Package,
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Mail,
  Send,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  Phone,
  Building,
} from 'lucide-react';
import { CustomerRecord, ProductRecord, ReportRecord } from '../types/rpa';

interface TargetWebAppProps {
  activeView: 'customers' | 'products' | 'reports';
  setActiveView: (view: 'customers' | 'products' | 'reports') => void;
  customers: CustomerRecord[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerRecord[]>>;
  products: ProductRecord[];
  setProducts: React.Dispatch<React.SetStateAction<ProductRecord[]>>;
  reports: ReportRecord[];
  setReports: React.Dispatch<React.SetStateAction<ReportRecord[]>>;
  // Active target selector for visual bot highlight
  activeSelector?: string;
  // Feedback badge
  botNotification?: string | null;
  // Modal open states controlled by bot or user
  isAddCustomerOpen: boolean;
  setIsAddCustomerOpen: (open: boolean) => void;
  customerFormData: { name: string; phone: string; email: string; company: string };
  setCustomerFormData: React.Dispatch<React.SetStateAction<{ name: string; phone: string; email: string; company: string }>>;
  // Price edit state
  editingProductId: string | null;
  setEditingProductId: (id: string | null) => void;
  priceInputValue: string;
  setPriceInputValue: (val: string) => void;
  // Email modal
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  emailRecipient: string;
  setEmailRecipient: (val: string) => void;
  // Verified row highlight (e.g. Pankaj Koche row)
  verifiedTargetName?: string | null;
}

export const TargetWebApp: React.FC<TargetWebAppProps> = ({
  activeView,
  setActiveView,
  customers,
  setCustomers,
  products,
  setProducts,
  reports,
  setReports,
  activeSelector,
  botNotification,
  isAddCustomerOpen,
  setIsAddCustomerOpen,
  customerFormData,
  setCustomerFormData,
  editingProductId,
  setEditingProductId,
  priceInputValue,
  setPriceInputValue,
  isEmailModalOpen,
  setIsEmailModalOpen,
  emailRecipient,
  setEmailRecipient,
  verifiedTargetName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<string | null>(null);

  const handleSaveCustomer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerFormData.name.trim()) return;

    const targetName = customerFormData.name.trim();
    setCustomers(prev => {
      const existingIdx = prev.findIndex(c => c.name.toLowerCase() === targetName.toLowerCase());
      const newCustomer: CustomerRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: targetName,
        phone: customerFormData.phone.trim() || '9876543210',
        email: customerFormData.email.trim() || `${targetName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        company: customerFormData.company.trim() || 'Enterprise Client',
        status: 'Customer',
        createdAt: new Date().toISOString().split('T')[0],
      };
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newCustomer;
        return updated;
      }
      return [newCustomer, ...prev];
    });

    setIsAddCustomerOpen(false);
    setCustomerFormData({ name: '', phone: '', email: '', company: '' });
  };

  const handleSavePrice = (productId: string) => {
    const numPrice = parseFloat(priceInputValue) || 599;
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: numPrice, lastUpdated: 'Just now' } : p))
    );
    setEditingProductId(null);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmTarget(null);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isHighlighted = (selectorId: string) => {
    if (!activeSelector) return false;
    return (
      activeSelector.includes(selectorId) ||
      activeSelector === selectorId ||
      activeSelector === `[data-testid="${selectorId}"]`
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full relative text-slate-800">
      {/* Target App Browser Header Bar */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-md border border-slate-200 text-xs text-slate-600 font-mono shadow-xs">
            <span className="text-emerald-600 font-semibold">https://</span>
            <span className="text-slate-500">crm.willovate.internal/portal/</span>
            <span className="text-indigo-600 font-bold">{activeView}</span>
          </div>
        </div>

        {/* Target App Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
          <button
            id="nav-customers"
            data-testid="nav-customers"
            onClick={() => setActiveView('customers')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === 'customers'
                ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            } ${isHighlighted('nav-customers') ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50' : ''}`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customers CRM</span>
          </button>

          <button
            id="nav-products"
            data-testid="nav-products"
            onClick={() => setActiveView('products')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === 'products'
                ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            } ${isHighlighted('nav-products') ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50' : ''}`}
          >
            <Package className="w-3.5 h-3.5 text-indigo-600" />
            <span>Products</span>
          </button>

          <button
            id="nav-reports"
            data-testid="nav-reports"
            onClick={() => setActiveView('reports')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeView === 'reports'
                ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            } ${isHighlighted('nav-reports') ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50' : ''}`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Bot Toast / Notification Bar */}
      {botNotification && (
        <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>{botNotification}</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            Activity Asserted
          </span>
        </div>
      )}

      {/* Target Application Body */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-[#F8FAFC]">
        {/* VIEW 1: CUSTOMERS CRM */}
        {activeView === 'customers' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="input-customer-search"
                    data-testid="input-customer-search"
                    placeholder="Search by customer name, phone, or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                      isHighlighted('input-customer-search') ? 'ring-2 ring-indigo-500 border-indigo-400' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-export-customers"
                  data-testid="btn-export-customers"
                  onClick={() => alert('Exporting customers table to CSV...')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all shadow-xs ${
                    isHighlighted('btn-export-customers') ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  id="btn-add-customer"
                  data-testid="btn-add-customer"
                  onClick={() => setIsAddCustomerOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-all active:scale-95 ${
                    isHighlighted('btn-add-customer') || isHighlighted('add-customer')
                      ? 'ring-4 ring-indigo-400 ring-offset-2 scale-105 shadow-md shadow-indigo-500/30'
                      : ''
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            {/* Customers Data Table */}
            <div
              id="customers-table"
              data-testid="customers-table"
              className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all ${
                isHighlighted('customers-table') ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Phone Number</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          No customer records found. Add one above!
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer, index) => {
                        const isVerifiedRow =
                          verifiedTargetName &&
                          customer.name.toLowerCase().includes(verifiedTargetName.toLowerCase());

                        return (
                          <tr
                            key={customer.id ? `${customer.id}-${index}` : `cust-${index}`}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isVerifiedRow
                                ? 'bg-indigo-50/70 border-l-4 border-indigo-600 animate-fadeIn font-medium'
                                : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-200">
                                  {customer.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                    <span>{customer.name}</span>
                                    {isVerifiedRow && (
                                      <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        Verified in DB
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400">Added: {customer.createdAt}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-700 font-medium">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{customer.phone}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                            <td className="px-4 py-3 text-slate-600">
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-slate-400" />
                                <span>{customer.company}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  customer.status === 'Customer'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : customer.status === 'Active'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {customer.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                id={`delete-cust-${customer.id}`}
                                data-testid="customer-row-action-delete"
                                onClick={() => setDeleteConfirmTarget(customer.id)}
                                className={`p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all ${
                                  isHighlighted('customer-row-action-delete') || isHighlighted('select-customer-row')
                                    ? 'ring-2 ring-rose-500 bg-rose-50 text-rose-600 animate-pulse'
                                    : ''
                                }`}
                                title="Delete customer record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCTS & PRICING */}
        {activeView === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="input-product-search"
                  data-testid="input-product-search"
                  placeholder="Search catalog products..."
                  className={`w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isHighlighted('input-product-search') || isHighlighted('search-product')
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map(prod => {
                const isEditing = editingProductId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className={`bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between transition-all ${
                      isHighlighted('edit-price') || isHighlighted('product-price')
                        ? 'ring-2 ring-indigo-500 shadow-sm'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {prod.sku}
                        </span>
                        <h4 className="font-semibold text-slate-900 text-sm mt-1">{prod.name}</h4>
                        <p className="text-xs text-slate-500">{prod.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900">₹{prod.price}</div>
                        <span className="text-[10px] text-slate-400">In Stock: {prod.stock}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="number"
                            id="input-product-price"
                            data-testid="input-product-price"
                            value={priceInputValue}
                            onChange={e => setPriceInputValue(e.target.value)}
                            placeholder="New Price"
                            className={`w-28 px-2 py-1 text-xs bg-slate-50 border border-indigo-500 rounded text-slate-900 focus:outline-none ${
                              isHighlighted('input-product-price') || isHighlighted('product-price')
                                ? 'ring-2 ring-indigo-500'
                                : ''
                            }`}
                          />
                          <button
                            id="btn-save-price"
                            data-testid="btn-save-price"
                            onClick={() => handleSavePrice(prod.id)}
                            className={`px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-all shadow-xs ${
                              isHighlighted('btn-save-price') || isHighlighted('save-price')
                                ? 'ring-2 ring-indigo-400'
                                : ''
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-slate-400">Updated: {prod.lastUpdated}</span>
                          <button
                            id="btn-edit-price"
                            data-testid="btn-edit-price"
                            onClick={() => {
                              setEditingProductId(prod.id);
                              setPriceInputValue(prod.price.toString());
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded transition-all ${
                              isHighlighted('btn-edit-price') || isHighlighted('edit-price')
                                ? 'ring-2 ring-indigo-500 bg-indigo-50 text-indigo-700'
                                : ''
                            }`}
                          >
                            Edit Price
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: REPORTS & ANALYTICS */}
        {activeView === 'reports' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Automated Analytics & Report Dispatch</h4>
                <p className="text-xs text-slate-500">Generate real-time business ledgers and trigger email automations.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-generate-sales-report"
                  data-testid="btn-generate-sales-report"
                  onClick={() => alert('Generated today\'s real-time sales transactions report!')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs ${
                    isHighlighted('btn-generate-sales-report') || isHighlighted('generate-daily-sales')
                      ? 'ring-4 ring-indigo-400'
                      : ''
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Today's Sales</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 text-xs">{rep.title}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{rep.format} • {rep.size} • Date: {rep.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-download-excel"
                      data-testid="btn-download-excel"
                      onClick={() => alert(`Downloading ${rep.title}...`)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md transition-all shadow-xs ${
                        isHighlighted('btn-download-excel') || isHighlighted('export-excel')
                          ? 'ring-2 ring-indigo-500'
                          : ''
                      }`}
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download Excel</span>
                    </button>

                    <button
                      id="btn-open-email-dispatch"
                      data-testid="btn-open-email-dispatch"
                      onClick={() => setIsEmailModalOpen(true)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md transition-all ${
                        isHighlighted('btn-open-email-dispatch') || isHighlighted('open-email-modal')
                          ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                          : ''
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD CUSTOMER FORM (Controlled by Bot or User) */}
      {isAddCustomerOpen && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fadeIn">
          <div
            id="modal-add-customer"
            className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-xl space-y-4 text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">Add New Customer</h3>
                  <p className="text-[11px] text-slate-500">Enter customer details into CRM registry</p>
                </div>
              </div>
              <button
                id="btn-cancel-customer-x"
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-customer-name"
                  data-testid="input-customer-name"
                  value={customerFormData.name}
                  onChange={e => setCustomerFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Pankaj Koche"
                  required
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    isHighlighted('input-customer-name') || isHighlighted('customer-name')
                      ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/20'
                      : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-customer-phone"
                  data-testid="input-customer-phone"
                  value={customerFormData.phone}
                  onChange={e => setCustomerFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  required
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono transition-all ${
                    isHighlighted('input-customer-phone') || isHighlighted('phone-number')
                      ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/20'
                      : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="input-customer-email"
                  data-testid="input-customer-email"
                  value={customerFormData.email}
                  onChange={e => setCustomerFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. pankaj.koche@enterprise.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  id="btn-cancel-customer"
                  data-testid="btn-cancel-customer"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-customer"
                  data-testid="btn-save-customer"
                  className={`px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-all ${
                    isHighlighted('btn-save-customer') || isHighlighted('save')
                      ? 'ring-4 ring-indigo-400 scale-105'
                      : ''
                  }`}
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EMAIL DISPATCH MODAL */}
      {isEmailModalOpen && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">Email Sales Report</h3>
                  <p className="text-[11px] text-slate-500">Send Excel file attachment directly to recipient</p>
                </div>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email Address</label>
                <input
                  type="email"
                  id="input-email-recipient"
                  data-testid="input-email-recipient"
                  value={emailRecipient}
                  onChange={e => setEmailRecipient(e.target.value)}
                  placeholder="manager@willovate.com"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isHighlighted('input-email-recipient') || isHighlighted('recipient-email')
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  }`}
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-slate-700 font-mono">Daily_Sales_Report.xlsx (1.4 MB)</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="btn-send-report-email"
                  data-testid="btn-send-report-email"
                  onClick={() => {
                    alert(`Report emailed to ${emailRecipient || 'manager@willovate.com'} successfully!`);
                    setIsEmailModalOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs ${
                    isHighlighted('btn-send-report-email') || isHighlighted('send-email')
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION (High Risk Guardrail in Target App) */}
      {deleteConfirmTarget && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fadeIn">
          <div className="bg-white border border-rose-200 rounded-xl p-5 max-w-sm w-full shadow-xl space-y-3 text-slate-800">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-slate-900">Confirm Record Deletion</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete this customer record from the database?
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="btn-modal-confirm-delete"
                data-testid="btn-modal-confirm-delete"
                onClick={() => handleDeleteCustomer(deleteConfirmTarget)}
                className={`px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs ${
                  isHighlighted('btn-modal-confirm-delete') || isHighlighted('confirm-delete-button')
                    ? 'ring-2 ring-rose-500'
                    : ''
                }`}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
