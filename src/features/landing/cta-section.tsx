import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section id="contact" className="py-20">
      <div className={"mx-12"}>
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
                Ready to Transform Healthcare in Your Facility?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the growing network of healthcare providers using our platform to deliver better care to patients
                across Senegal. Contact us to schedule a demo or learn more about implementation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Email Us</h3>
                    <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                    <Link href="mailto:contact@medicare.sn" className="text-primary hover:underline">
                      contact@medicare.sn
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent-foreground">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Call Us</h3>
                    <p className="text-muted-foreground mb-2">Mon-Fri, 8am-6pm GMT</p>
                    <Link href="tel:+221338765432" className="text-primary hover:underline">
                      +221 33 876 54 32
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Request a Demo</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" placeholder="Dr. John Doe"/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="john.doe@hospital.sn"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="facility" className="text-sm font-medium">
                    Healthcare Facility
                  </label>
                  <Input id="facility" placeholder="Dakar General Hospital"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell us about your facility and needs..." rows={4}/>
                </div>
                <Button type="submit" className="w-full">
                  Request Demo
                  <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <Link href="#" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
