import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const performOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (prev === null) {
      setPrev(inputValue);
    } else if (operator) {
      const result = calculate(prev, inputValue, operator);
      setDisplay(String(result));
      setPrev(result);
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && prev !== null) {
      const result = calculate(prev, inputValue, operator);
      setDisplay(String(result));
      setPrev(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <Card className="mx-auto max-w-sm border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CalculatorIcon className="h-5 w-5 text-primary" />
          حاسبة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-border bg-background p-4 text-left text-3xl font-bold tabular-nums text-foreground">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" className="col-span-4 border-border" onClick={clear}>
            مسح (C)
          </Button>
          {buttons.map((row) =>
            row.map((btn) => (
              <Button
                key={btn}
                variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "outline"}
                className={cn(
                  ["÷", "×", "-", "+", "="].includes(btn) ? "bg-primary text-primary-foreground" : "border-border"
                )}
                onClick={() => {
                  if (btn === ".") inputDecimal();
                  else if (btn === "=") handleEquals();
                  else if (["÷", "×", "-", "+"].includes(btn)) performOperator(btn);
                  else inputDigit(btn);
                }}
              >
                {btn}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}