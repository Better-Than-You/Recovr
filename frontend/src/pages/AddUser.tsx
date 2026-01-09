import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AddUser() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        accountNumber: '',
        customerName: '',
        accountType: 'corporate',
        customerTier: 'standard',
        historicalHealth: 'good',
        customerEmail: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        region: '',
        dueDate: '',
        amountDue: '',
        serviceType: 'express',
    })

    const steps = [
        { id: 1, title: "Account Details", description: "Basic info" },
        { id: 2, title: "Contact Info", description: "Email & Phone" },
        { id: 3, title: "Address Details", description: "Location" },
        { id: 4, title: "Service & Payment", description: "Billing" }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        console.log('Submitting customer data:', formData)

        setTimeout(() => {
            setLoading(false)
            navigate('/customers')
        }, 1000)
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col min-h-screen md:min-h-0">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Add New Customer</h1>
                    <p className="text-sm text-slate-500">Create a new customer profile</p>
                </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="mb-10 w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center relative">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
                    {/* Progress Line */}
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -z-10 transition-all duration-500 ease-out -translate-y-1/2"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2 cursor-default">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2 z-10",
                                currentStep > step.id ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" :
                                    currentStep === step.id ? "bg-white border-indigo-600 text-indigo-600 shadow-md shadow-indigo-100 scale-110" :
                                        "bg-slate-50 border-slate-200 text-slate-400"
                            )}>
                                {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.id}
                            </div>
                            <div className="text-center absolute mt-12 w-32 -mx-16">
                                <span className={cn(
                                    "block text-xs font-semibold uppercase tracking-wider mb-0.5 transition-colors",
                                    currentStep >= step.id ? "text-slate-900" : "text-slate-400"
                                )}>{step.title}</span>
                                <span className="block text-[10px] text-slate-400 font-medium">{step.description}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spacer for floating labels */}
            <div className="h-4 mb-6"></div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px] flex flex-col relative transition-all duration-300 ease-in-out">

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full">

                    <div className="flex-1">
                        {/* Step 1: Account Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
                                    <p className="text-sm text-slate-500 mt-1">Enter basic identification details.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-slate-700">Account Number</label>
                                            <input
                                                required
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="ACC-12345"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-slate-700">Customer Name</label>
                                            <input
                                                required
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="e.g. Acme Corp"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Account Type</label>
                                            <select
                                                name="accountType"
                                                value={formData.accountType}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white cursor-pointer"
                                            >
                                                <option value="corporate">Corporate</option>
                                                <option value="individual">Individual</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Customer Tier</label>
                                            <select
                                                name="customerTier"
                                                value={formData.customerTier}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white cursor-pointer"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="gold">Gold</option>
                                                <option value="platinum">Platinum</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">History</label>
                                            <select
                                                name="historicalHealth"
                                                value={formData.historicalHealth}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white cursor-pointer"
                                            >
                                                <option value="excellent">Excellent</option>
                                                <option value="good">Good</option>
                                                <option value="fair">Fair</option>
                                                <option value="poor">Poor</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact Info */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Contact Details</h2>
                                    <p className="text-sm text-slate-500 mt-1">How should we reach this customer?</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Customer Email</label>
                                        <input
                                            required
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                            placeholder="contact@example.com"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Address Details</h2>
                                    <p className="text-sm text-slate-500 mt-1">Billing or main office location.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Street Address</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                            placeholder="123 Main St"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">City</label>
                                            <input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">State</label>
                                            <input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Zip Code</label>
                                            <input
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="Zip Code"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Region</label>
                                            <input
                                                required
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="NA"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Service & Payment */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Service & Payment</h2>
                                    <p className="text-sm text-slate-500 mt-1">Configure service parameters.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Service Type</label>
                                        <select
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white cursor-pointer"
                                        >
                                            <option value="express">Express</option>
                                            <option value="ground">Ground</option>
                                            <option value="freight">Freight</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Due Date</label>
                                            <input
                                                required
                                                type="date"
                                                name="dueDate"
                                                value={formData.dueDate}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white cursor-pointer"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Amount Due ($)</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                name="amountDue"
                                                value={formData.amountDue}
                                                onChange={handleChange}
                                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:bg-slate-100 focus:bg-white"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-auto">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={currentStep === 1 ? () => navigate('/customers') : prevStep}
                            className="min-w-[100px] h-10"
                        >
                            {currentStep === 1 ? 'Cancel' : (
                                <>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-3">
                            {currentStep < 4 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700 h-10 shadow-lg shadow-indigo-100"
                                >
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="min-w-[120px] bg-green-600 hover:bg-green-700 h-10 shadow-lg shadow-green-100"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Saving...' : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
