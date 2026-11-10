
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// 라이트 <-> 다크 한 번에 전환. 아이콘은 CSS(dark:)로 바꿔 hydration 불일치가 없다.
function DarkBtn() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="테마 전환"
      title="테마 전환"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="block dark:hidden" strokeWidth={1.75} />
      <Moon className="hidden dark:block" strokeWidth={1.75} />
    </Button>
  );
}

export default DarkBtn;
