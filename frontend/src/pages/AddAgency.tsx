import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Building2, ShieldCheck, Globe, CreditCard } from 'lucide-react'

export function AddAgency() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulation only
        setTimeout(() => {
            setLoading(false)
            navigate('/agencies')
        }, 1500)
    }

    return (
        <div className="min-h-[80vh] flex flex-col">
            <div className="p-8 max-w-5xl mx-auto w-full flex-1">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/agencies')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Onboard New DCA Partner
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Add a verified third-party agency to the recovery network
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                                <h3 className="font-semibold text-slate-900">Agency Profile</h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agency Name</label>
                                            <input
                                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                                                placeholder="e.g. Acme Recovery Services"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License Number</label>
                                            <input
                                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                                                placeholder="LIC-2024-XXXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Complete Address</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border-slate-200 border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                                            placeholder="123 Financial District, Suite 500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City</label>
                                            <input className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State</label>
                                            <input className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Zip</label>
                                            <input className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="pt-4 pb-2">
                                        <div className="h-px bg-slate-100 w-full" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating Region</label>
                                            <select className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none text-slate-600">
                                                <option>North America (All)</option>
                                                <option>East Coast</option>
                                                <option>West Coast</option>
                                                <option>Midwest</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Case Capacity</label>
                                            <select className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none text-slate-600">
                                                <option>Up to 1,000 cases/mo</option>
                                                <option>1,000 - 5,000 cases/mo</option>
                                                <option>5,000+ cases/mo</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" size="lg" onClick={() => navigate('/agencies')} className="px-8">
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                            >
                                {loading ? 'Onboarding...' : 'Onboard Agency'}
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                            <ShieldCheck className="w-10 h-10 mb-4 opacity-80" />
                            <h3 className="text-lg font-semibold mb-2">Compliance Verification</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                All agencies must be vetted for FDCPA compliance before onboarding. Automated background checks will be initiated upon submission.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-500" />
                                Coverage Map
                            </h3>
                            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                                [Interactive Map Placeholder]
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">High Demand</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Optimal</span>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    )
}
