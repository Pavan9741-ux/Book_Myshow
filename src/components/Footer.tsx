import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    "Movies Now Showing": ["Galactic Wars", "The Dark Knight", "Interstellar Journey", "Eternal Sunshine"],
    "Upcoming Movies": ["Quantum Break", "The Last Kingdom", "Ocean's Depths", "Cyber Revolt"],
    "Help & Support": ["About Us", "Contact Us", "FAQs", "Terms of Use", "Privacy Policy"],
  };

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Book<span className="text-primary">My</span>Show
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Your one-stop destination for booking movie tickets, events, plays, and more.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 BookMyShow Clone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
