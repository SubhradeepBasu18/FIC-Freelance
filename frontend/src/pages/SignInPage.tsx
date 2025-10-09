import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '@/configApi/admin';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginAdmin(formData.email, formData.password);
            console.log("Response: ", response);

            if (response.status === 200) {
                navigate('/admin');
            } else {
                setError(response.data.message || 'Sign in failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold italic text-white mb-6 tracking-tight">
                        Admin Sign In
                    </h1>
                    <div className="w-24 h-1 accent-bg mx-auto mb-8"></div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Access the admin dashboard to manage events, sponsors, and website content.
                    </p>
                </div>

                {/* Sign In Form */}
                <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-accent/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 pr-10 bg-zinc-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full accent-bg primary-text py-3 px-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                Forgot your password?{' '}
                                <a href="/reset-password" className="text-accent hover:underline">
                                    Reset here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center">
                    <div className="bg-gradient-to-r from-zinc-500/10 to-blue-500/10 rounded-2xl p-6 border border-accent/20">
                        <h3 className="text-lg font-bold text-white mb-2">Security Notice</h3>
                        <p className="text-gray-300 text-sm">
                            This area is restricted to authorized personnel only. Unauthorized access attempts will be logged.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;