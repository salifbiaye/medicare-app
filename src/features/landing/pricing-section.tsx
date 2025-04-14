import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function PricingSection() {
    return (
        <section id={"pricing"} className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
                    <p className="text-muted-foreground">ShadowFit evolves beyond just workout tracking. It offers comprehensive APIs and platforms to help developers and businesses innovate in fitness technology.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
                    <div className="rounded-lg flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-medium">Free</h2>
                                <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
                                <p className="text-muted-foreground text-sm">Per user</p>
                            </div>

                            <Button asChild variant="outline" className="w-full hover:bg-muted">
                                <Link href="">Get Started</Link>
                            </Button>

                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Basic workout tracking', '5 exercise demonstrations', 'Email support'].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 shadow-lg shadow-muted/5 md:col-span-3 lg:p-10 bg-muted">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="font-medium">Pro</h2>
                                    <span className="my-3 block text-2xl font-semibold">$19 / mo</span>
                                    <p className="text-muted-foreground text-sm">Per user</p>
                                </div>

                                <Button asChild className="w-full">
                                    <Link href="">Get Started</Link>
                                </Button>
                            </div>

                            <div>
                                <div className="text-sm font-medium">Everything in Free plus:</div>

                                <ul className="mt-4 list-outside space-y-3 text-sm">
                                    {['Advanced analytics dashboard', 'Unlimited workout plans', 'Priority support', 'Access to premium exercises', '3D body tracking', 'AI-powered recommendations', 'Custom workout creator', 'Progress reports', 'Community challenges', 'Premium security features'].map((item, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check className="size-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}