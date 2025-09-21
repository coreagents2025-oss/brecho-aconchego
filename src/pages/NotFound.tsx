import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-4">
          <div className="text-8xl font-display font-bold text-primary/20 select-none">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Ops! Essa peça não está no nosso catálogo
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            Parece que você se perdeu entre as araras do nosso brechó virtual! 
            Não se preocupe, acontece com todo mundo quando estamos procurando 
            aquela peça perfeita.
          </p>
          <p className="text-muted-foreground font-body">
            Que tal voltarmos ao catálogo para encontrar outras lindezas?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[200px]">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Voltar ao Catálogo
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[200px]">
            <Link to="/#search" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Peças
            </Link>
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="pt-8">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-body">
            <span className="w-8 h-px bg-border"></span>
            <span>Brechó da Vez - Moda Sustentável</span>
            <span className="w-8 h-px bg-border"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
