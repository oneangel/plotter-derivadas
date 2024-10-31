import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface GraphTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function GraphTabs({ activeTab, onTabChange }: GraphTabsProps) {
  const tabs = [
    { value: 'original', label: 'Original', symbol: 'f(x,y)' },
    { value: 'dx', label: 'X Derivative', symbol: '∂f/∂x' },
    { value: 'dy', label: 'Y Derivative', symbol: '∂f/∂y' }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className="text-sm md:text-base"
          >
            <span className="hidden md:inline">{tab.label}</span>
            <span className="md:hidden">{tab.symbol}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div 
                id={`plot-${tab.value}`} 
                className="w-full h-[500px] rounded-lg transition-all duration-300"
                style={{ 
                  opacity: activeTab === tab.value ? 1 : 0,
                  display: activeTab === tab.value ? 'block' : 'none' 
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}