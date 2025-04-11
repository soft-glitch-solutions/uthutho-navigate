
import React from 'react';
import { Stop, Route, Hub } from '@/types/stops';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Route as RouteIcon, Building } from 'lucide-react';

interface StopCardProps {
  stop: Stop;
  onEdit: (stop: Stop) => void;
  onDelete: (stop: Stop) => void;
  getRoutesForStop: (stopId: string) => Route[];
  getHubsForStop: (stopId: string) => Hub[];
}

export const StopCard = ({
  stop,
  onEdit,
  onDelete,
  getRoutesForStop,
  getHubsForStop
}: StopCardProps) => {
  return (
    <Card key={stop.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{stop.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
            <p className="text-sm">{stop.latitude}, {stop.longitude}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cost</p>
            <p className="text-sm">{stop.cost ? `R${stop.cost}` : 'Free'}</p>
          </div>
        </div>
        
        {stop.notes && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{stop.notes}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {getRoutesForStop(stop.id).map(route => (
            <Badge key={route.id} className="flex items-center gap-1 bg-blue-100 text-blue-800">
              <RouteIcon className="h-3 w-3" />
              {route.name}
            </Badge>
          ))}
          
          {getHubsForStop(stop.id).map(hub => (
            <Badge key={hub.id} className="flex items-center gap-1 bg-amber-100 text-amber-800">
              <Building className="h-3 w-3" />
              {hub.name}
            </Badge>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(stop)}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(stop)}
            className="flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
