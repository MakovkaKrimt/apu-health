"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/shared/assets/logoDipp.png";
// Assuming that Lucid UI has built-in icons for Eye (show) and EyeOff (hide)

import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic check (could be replaced with an API request)
    if (login === "User_1" && password === "Password_1") {
      localStorage.setItem("auth", "true");
      router.push("/main"); // Redirect after login
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <div className="loginHeaderContainer">
              <img src={logo.src} alt="" className="loginLogo" />
              <p>Генератор презентаций </p>
              <p>ДИПП</p>
              <br />
              <br />
            </div>
          </CardTitle>
          <CardDescription>Введите данные для входа в систему</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  value={password}
                  placeholder="Пароль"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="link"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? (
                    <EyeOff size={20} className="mt-5" /> // Show "eye-off" icon from Lucid UI
                  ) : (
                    <Eye size={20} className="mt-5" /> // Show "eye" icon from Lucid UI
                  )}
                </Button>
              </div>
              {error && <p className="text-sky-900 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-sky-700 hover:bg-sky-900"
              >
                Войти
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
