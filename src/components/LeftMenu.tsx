import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { Home, UserCircle, Users, BarChart, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LeftMenuProps {
  className?: string;
}

export function LeftMenu({ className }: LeftMenuProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t("navigation.dashboard"),
      icon: Home,
      href: "/",
    },
    {
      title: t("navigation.customers"),
      icon: UserCircle,
      href: "/customers",
    },
    {
      title: t("navigation.users"),
      icon: Users,
      href: "/users",
    },
    {
      title: t("navigation.analytics"),
      icon: BarChart,
      href: "/analytics",
    },
    {
      title: t("navigation.settings"),
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] w-64 border-r border-primary/10 bg-background/95",
        className
      )}
    >
      <div className="h-full py-4">
        <div className="h-full px-3">
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={
                    location.pathname === item.href ? "secondary" : "ghost"
                  }
                  className={cn(
                    "w-full justify-start transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "hover:bg-primary/5 hover:text-primary"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        location.pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
