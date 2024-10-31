import { FunctionSquare, Calculator } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface GraphControlsProps {
  func: string;
  xRange: string;
  yRange: string;
  onFuncChange: (value: string) => void;
  onXRangeChange: (value: string) => void;
  onYRangeChange: (value: string) => void;
  onPlot: () => void;
}

export function GraphControls({
  func,
  xRange,
  yRange,
  onFuncChange,
  onXRangeChange,
  onYRangeChange,
  onPlot
}: GraphControlsProps) {
  return (
    <Card className="p-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="function">
            <FunctionSquare className="w-4 h-4 inline mr-2" />
            Función original f(x,y)
          </Label>
          <Input
            id="function"
            value={func}
            onChange={(e) => onFuncChange(e.target.value)}
            placeholder="Ingresa una función (e.g., x^2 + y^2)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="xrange">Rango X (min,max)</Label>
            <Input
              id="xrange"
              value={xRange}
              onChange={(e) => onXRangeChange(e.target.value)}
              placeholder="-10,10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yrange">Rango Y (min,max)</Label>
            <Input
              id="yrange"
              value={yRange}
              onChange={(e) => onYRangeChange(e.target.value)}
              placeholder="-10,10"
            />
          </div>
        </div>

        <Button onClick={onPlot} className="w-full" >
          <Calculator className="w-4 h-4 mr-2" />
          Graficar Función y Derivadas
        </Button>
      </div>
    </Card>
  );
}