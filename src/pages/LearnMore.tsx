const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-trust min-h-full">
      {/* Header removed because it is already in App.tsx */}
      <main className="flex flex-col">
        <div className="container pt-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <section className="container py-16 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 py-8 text-foreground">
            {/* How It Works Section - Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-primary border-b pb-2">How it works</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-border">
                  <h3 className="font-bold text-lg mb-2 text-healthcare-blue">Data Aggregation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Consolidates open-access data from HPRA CTIS, ClinicalTrials.gov, and WHO ICTRP into a unified database.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-border">
                  <h3 className="font-bold text-lg mb-2 text-healing-green">AI Translation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Transforms complex eligibility criteria into patient-friendly summaries.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-border">
                  <h3 className="font-bold text-lg mb-2 text-primary">Smart Matching</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Connects patients with relevant trials while maintaining full GDPR compliance and data sovereignty.
                  </p>
                </div>
              </div>
            </section>
          
            <hr className="my-12 border-muted" />
          
            {/* Privacy Policy Section */}
            <article className="space-y-8">
              <header>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                  Privacy & How We Use Your Collected Medical Information
                </h1>
              </header>
          
              <section>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Medical Information</h2>
                <p className="mb-4">We collect and process the medical information you provide so that we can:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Determine your eligibility</strong> for our clinical studies and monitor your participation safely</li>
                  <li><strong>Provide appropriate healthcare or research services</strong> in line with study protocols</li>
                  <li><strong>Comply with legal and regulatory obligations</strong>, including safety reporting, ethics committee requirements, and regulatory authority requirements</li>
                  <li><strong>Analyse anonymised or pseudonymised health data</strong> to improve our services and support scientific research</li>
                </ul>
              </section>
          
              <hr className="border-muted" />
          
              <section>
                <h2 className="text-2xl font-bold mb-4">Legal Basis for Processing Medical Information</h2>
                <p className="mb-6 leading-relaxed">
                  Medical information is considered a <strong>special category of personal data</strong> under the GDPR. 
                  We only process it where a lawful basis applies and with appropriate safeguards in place:
                </p>
          
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Explicit Consent</h3>
                    <p className="text-muted-foreground">
                      We will obtain your <strong>explicit consent</strong> before collecting and using your medical information for clinical research, participation in studies, or related services. You may withdraw this consent at any time.
                    </p>
                  </div>
          
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Legal and Regulatory Obligations</h3>
                    <p className="text-muted-foreground">
                      We may process your medical information where it is necessary to comply with applicable laws, regulations, or regulatory authority requirements relating to clinical trials, health and safety, or public health.
                    </p>
                  </div>
          
                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Scientific Research & Public Interest in Health</h3>
                    <p className="text-muted-foreground">
                      Where permitted under <strong>GDPR Article 9(2)</strong>, we may process your medical information for scientific or public health research purposes with appropriate safeguards, such as <strong>pseudonymisation or anonymisation</strong>.
                    </p>
                  </div>
                </div>
              </section>
          
              <hr className="border-muted" />
          
              <section>
                <h2 className="text-2xl font-bold mb-4">Data Security & Retention</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your medical information is processed securely.</li>
                  <li>Access is restricted to authorised personnel only.</li>
                  <li>Data is retained only as long as necessary for the stated purposes or as required by law.</li>
                </ul>
              </section>
          
              <hr className="border-muted" />
          
              {/* Technical Breakdown Section */}
              <section>
                <h2 className="text-3xl font-bold mb-6">How It Works (Technical Breakdown)</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Data Aggregation</h3>
                    <p className="mb-2">Consolidates open-access data from:</p>
                    <ul className="list-disc pl-6 mb-4">
                      <li>HPRA CTIS</li>
                      <li>ClinicalTrials.gov</li>
                      <li>WHO ICTRP</li>
                    </ul>
                    <p>into a unified database.</p>
                  </div>
          
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">AI Translation</h3>
                    <p>
                      Transforms complex clinical trial eligibility criteria into <strong>clear, patient-friendly summaries</strong>.
                    </p>
                  </div>
          
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Smart Matching</h3>
                    <p>
                      Connects patients with relevant clinical trials while maintaining full <strong>GDPR compliance</strong> and <strong>data sovereignty</strong>.
                    </p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
      {/* Footer removed because it is already in App.tsx */}
    </div>
  );
};
