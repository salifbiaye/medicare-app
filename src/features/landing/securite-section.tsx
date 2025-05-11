"use client"

export function SecuriteSection() {
  return (
      <div id={"security"} className="py-12  ">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-6">Quels problèmes notre plateforme résout-elle?</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-primary/10 dark:bg-muted/15  rounded-xl p-8 ">
              <div className="bg-white/95 dark:bg-muted/50 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-muted/20 rounded-xl border-2 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Sécurité des données</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Comprendre vos défis de sécurité des données est essentiel. Notre plateforme assure un chiffrement
                      de bout en bout, une authentification forte et des audits réguliers, protégeant les données
                      sensibles des patients conformément aux normes RGPD et HIPAA.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-muted/20 rounded-xl border-2 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Accès aux soins</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Les coûts élevés et les distances compliquent l'accès aux soins spécialisés. Notre solution de
                      télémédecine permet aux patients des zones rurales de consulter des spécialistes sans déplacement,
                      réduisant les coûts et améliorant l'accès aux soins de qualité.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-muted/20 rounded-xl border-2 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-amber-600 dark:text-amber-400"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Défis opérationnels</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Les défis logistiques limitent l'efficacité médicale. Notre plateforme optimise la gestion des
                      dossiers patients, la planification des consultations et le suivi des traitements, permettant aux
                      professionnels de santé de se concentrer sur les soins plutôt que l'administration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
