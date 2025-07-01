import type { ComponentRegistry } from '../types.js';
import { TextComponent } from './TextComponent.js';
import { TableComponent } from './TableComponent.js';
import { ChartComponent } from './ChartComponent.js';
import { ListComponent } from './ListComponent.js';
import { CardComponent } from './CardComponent.js';
import { TimelineComponent } from './TimelineComponent.js';
import { FormComponent } from './FormComponent.js';
import { MapComponent } from './MapComponent.js';
import { GalleryComponent } from './GalleryComponent.js';

/**
 * Registry mapping UI component types to React components
 * Each component receives standardized props from the classification result
 */
export const componentRegistry: ComponentRegistry = {
  /* Basic content types */
  text: TextComponent,
  card: CardComponent,
  
  /* Data display types */
  table: TableComponent,
  list: ListComponent,
  chart: ChartComponent,
  graph: ChartComponent, // Alias for chart
  
  /* Interactive types */
  form: FormComponent,
  
  /* Layout types */
  timeline: TimelineComponent,
  gallery: GalleryComponent,
  
  /* Specialized types */
  map: MapComponent,
  
  /* Advanced types (fallback to simpler components for now) */
  tree: ListComponent,
  grid: TableComponent,
  tabs: CardComponent,
  accordion: CardComponent,
  dialog: FormComponent,
  calendar: TimelineComponent,
  kanban: TableComponent,
  dashboard: ChartComponent,
  carousel: GalleryComponent,
  stepper: TimelineComponent,
  rating: TextComponent,
  badge: TextComponent,
  progress: TextComponent,
  skeleton: TextComponent,
  notification: CardComponent
};