import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { socialLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const icons = { twitter: Twitter, instagram: Instagram, facebook: Facebook, linkedin: Linkedin, email: Mail };

/** Row of icon-only social links. */
export function SocialIcons({ className, iconClassName = "h-4 w-4" }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socialLinks.map(({ id, name, href }) => {
        const Icon = icons[id];
        return (
          <a
            key={id}
            href={href}
            aria-label={name}
            title={name}
            className="hover:text-accent"
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
}
