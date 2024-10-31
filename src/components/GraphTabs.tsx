import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export function GraphTabs({ onTabChange }) {
  return (
    <Tabs defaultValue="original" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="original">Original</TabsTrigger>
        <TabsTrigger value="dx">∂f/∂x</TabsTrigger>
        <TabsTrigger value="dy">∂f/∂y</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <Card>
          <div id="plot-original" className="w-full h-[600px]" />
        </Card>
      </TabsContent>
      <TabsContent value="dx">
        <Card>
          <div id="plot-dx" className="w-full h-[600px]" />
        </Card>
      </TabsContent>
      <TabsContent value="dy">
        <Card>
          <div id="plot-dy" className="w-full h-[600px]" />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
