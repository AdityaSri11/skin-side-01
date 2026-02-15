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
          {/* ... your content ... */}
        </section>
      </main>
      {/* Footer removed because it is already in App.tsx */}
    </div>
  );
};
