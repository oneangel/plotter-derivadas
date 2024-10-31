import { useState, useEffect } from "react";
import { GraphControls } from "./GraphControls";
import { GraphTabs } from "./GraphTabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { create, all } from "mathjs";
import { TypeAnimation } from "react-type-animation";

const math = create(all);

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function Grapher() {
  const [func, setFunc] = useState("");
  const [xRange, setXRange] = useState("");
  const [yRange, setYRange] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("original");
  const { toast } = useToast();

  const loadPlotly = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Plotly) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-latest.min.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Plotly library."));
      document.head.appendChild(script);
    });
  };

  const generatePlotData = (expr, xMin, xMax, yMin, yMax) => {
    const xValues = [];
    const yValues = [];
    const zValues = [];
    const step = 0.5; // Using the same step as in the script version

    try {
      const compiled = math.compile(expr);

      // Generate x values
      for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
      }

      // Generate y values
      for (let y = yMin; y <= yMax; y += step) {
        yValues.push(y);
      }

      // Generate z values
      for (let x = xMin; x <= xMax; x += step) {
        const zRow = [];
        for (let y = yMin; y <= yMax; y += step) {
          try {
            const value = compiled.evaluate({ x, y });
            zRow.push(value);
          } catch (err) {
            zRow.push(NaN);
          }
        }
        zValues.push(zRow);
      }

      return { x: xValues, y: yValues, z: zValues };
    } catch (err) {
      throw new Error("Invalid function expression");
    }
  };

  const plot = async () => {
    try {
      await loadPlotly();

      setError("");
      const [xMin, xMax] = xRange.split(",").map(Number);
      const [yMin, yMax] = yRange.split(",").map(Number);

      if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
        throw new Error("Invalid range values");
      }

      // Calculate derivatives using math.js
      const dx = math.derivative(func, "x");
      const dy = math.derivative(func, "y");

      // Generate data for all three plots
      const originalData = generatePlotData(func, xMin, xMax, yMin, yMax);
      const dxData = generatePlotData(dx.toString(), xMin, xMax, yMin, yMax);
      const dyData = generatePlotData(dy.toString(), xMin, xMax, yMin, yMax);

      const commonLayout = {
        scene: {
          camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
          zaxis: { range: [-100, 100] },
        },
        margin: { l: 0, r: 0, t: 30, b: 0 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        showlegend: true,
        height: 500,
      };

      const plots = {
        original: {
          data: originalData,
          layout: { ...commonLayout, title: "Funcion Original" },
          colorscale: "Viridis",
        },
        dx: {
          data: dxData,
          layout: { ...commonLayout, title: "Derivada parcial de x" },
          colorscale: "Bluered",
        },
        dy: {
          data: dyData,
          layout: { ...commonLayout, title: "Derivada parcial de y" },
          colorscale: "Electric",
        },
      };

      const currentPlot = plots[activeTab];
      const plotDiv = `plot-${activeTab}`;

      window.Plotly.newPlot(
        plotDiv,
        [
          {
            type: "surface",
            ...currentPlot.data,
            colorscale: currentPlot.colorscale,
            showscale: false,
            name: currentPlot.layout.title,
          },
        ],
        currentPlot.layout
      );

      toast({
        title: "Graphs updated",
        description: `∂f/∂x = ${dx.toString()}\n∂f/∂y = ${dy.toString()}`,
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
    if (func && xRange && yRange) {
      plot();
    }
  }, [activeTab, func, xRange, yRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight ">
          Graficador de Derivadas Parciales 📊📈❗
        </h1>
        <p>
          <TypeAnimation
            sequence={[
              "Ingresa una función para graficarla",
              1000,
              "Navega entre las graficas de las derivdas",
              1000,
            ]}
            wrapper="span"
            speed={50}
            className="text-xl text-purple-800"
            repeat={Infinity}
          />
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        <div className="lg:w-1/3">
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

        <div className="lg:w-2/3">
          <GraphTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div
            id={`plot-${activeTab}`}
            className="w-full h-[200px] bg-white rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
