import { useState, useEffect } from 'react';
import { GraphControls } from './GraphControls';
import { GraphTabs } from './GraphTabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { create, all } from 'mathjs';

const math = create(all);

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function Grapher() {
  const [func, setFunc] = useState('');
  const [xRange, setXRange] = useState('');
  const [yRange, setYRange] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('original');
  const { toast } = useToast();

  const loadPlotly = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Plotly) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Plotly library."));
      document.head.appendChild(script);
    });
  };

  const generateData = (expr, xMin, xMax, yMin, yMax) => {
    const xValues = [];
    const yValues = [];
    const zValues = [];
    const step = 0.2;

    try {
      const compiled = math.compile(expr);

      for (let x = xMin; x <= xMax; x += step) {
        const zRow = [];
        for (let y = yMin; y <= yMax; y += step) {
          zRow.push(compiled.evaluate({ x, y }));
        }
        zValues.push(zRow);
        xValues.push(x);
      }

      for (let y = yMin; y <= yMax; y += step) {
        yValues.push(y);
      }

      return { x: xValues, y: yValues, z: zValues };
    } catch (err) {
      throw new Error('Invalid function expression');
    }
  };

  const plot = async () => {
    try {
      await loadPlotly();

      setError('');
      const [xMin, xMax] = xRange.split(',').map(Number);
      const [yMin, yMax] = yRange.split(',').map(Number);

      if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
        throw new Error('Rango invalido de valores');
      }

      const originalData = generateData(func, xMin, xMax, yMin, yMax);
      const dx = math.derivative(func, 'x').toString();
      const dy = math.derivative(func, 'y').toString();

      const dxData = generateData(dx, xMin, xMax, yMin, yMax);
      const dyData = generateData(dy, xMin, xMax, yMin, yMax);

      const layout = {
        scene: { camera: { eye: { x: 2, y: 2, z: 2 } } },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: true
      };

      if (activeTab === 'original') {
        window.Plotly.newPlot('plot-original', [{
          type: 'surface',
          ...originalData,
          colorscale: 'Viridis',
          showscale: false
        }], { ...layout, title: 'Original Function' });
      } else if (activeTab === 'dx') {
        window.Plotly.newPlot('plot-dx', [{
          type: 'surface',
          ...dxData,
          colorscale: 'RdBu',
          showscale: false
        }], { ...layout, title: 'Partial Derivative ∂f/∂x' });
      } else if (activeTab === 'dy') {
        window.Plotly.newPlot('plot-dy', [{
          type: 'surface',
          ...dyData,
          colorscale: 'Plasma',
          showscale: false
        }], { ...layout, title: 'Partial Derivative ∂f/∂y' });
      }

      toast({
        title: "Graphs updated",
        description: `∂f/∂x = ${dx}\n∂f/∂y = ${dy}`,
      });

    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  useEffect(() => {
    plot();
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Graficador de Derivadas Parciales</h1>
      </div>

      <div className="flex space-x-8 mt-4">
        <div className="flex-1">
          <GraphControls
            func={func}
            xRange={xRange}
            yRange={yRange}
            onFuncChange={setFunc}
            onXRangeChange={setXRange}
            onYRangeChange={setYRange}
            onPlot={plot}
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex-1">
          <GraphTabs onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}




