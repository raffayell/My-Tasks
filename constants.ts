import { Task, ColumnDefinition } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Սերվերի վերանորոգում", desc: "Հիմնական բազայի խափանում", project: "Development", group: "urgent", dueDate: "2024-05-20" },
  { id: 2, title: "Հաշվետվության կազմում", desc: "Հունվար ամսվա ֆինանսական հաշվետվություն", project: "Finance", group: "today" },
  { id: 3, title: "Լոգոյի դիզայն", desc: "Նոր հաճախորդի համար տարբերակներ", project: "Design", group: "waiting", dueDate: "2024-06-01" },
  { id: 4, title: "Թիմային հանդիպում", desc: "Քննարկել նոր նախագիծը", project: "Marketing", group: "tomorrow" },
  { id: 5, title: "Գրասենյակային գույք", desc: "Պատվիրել նոր աթոռներ", project: "Finance", group: "not-urgent" },
  { id: 6, title: "Client Call", desc: "Հաստատել տեխնիկական առաջադրանքը", project: "Development", group: "urgent", dueDate: "2024-05-22" },
  { id: 7, title: "Instagram Post", desc: "Գրել տեքստ և ընտրել նկար", project: "Marketing", group: "today" },
  { id: 8, title: "React Կուրս", desc: "Դիտել 5-րդ մոդուլը", project: "Development", group: "not-urgent", dueDate: "2024-07-15" },
  { id: 9, title: "Email պատասխաններ", desc: "Պատասխանել գործընկերներին", project: "Marketing", group: "today" },
  { id: 10, title: "Բյուջեի պլանավորում", desc: "2024 Q2 պլանավորում", project: "Finance", group: "waiting" },
  { id: 11, title: "UI Kit թարմացում", desc: "Ավելացնել նոր կոճակների ստայլեր", project: "Design", group: "tomorrow" }
];

export const COLUMNS: ColumnDefinition[] = [
  { id: 'urgent', title: 'Urgent / Հրատապ' },
  { id: 'today', title: 'For Today / Այսօր' },
  { id: 'tomorrow', title: 'For Tomorrow / Վաղը' },
  { id: 'waiting', title: 'Waiting / Սպասման մեջ' },
  { id: 'not-urgent', title: 'Not Urgent / Ոչ հրատապ' },
  { id: 'done', title: 'Done / Կատարված' }
];

export const PROJECTS = ['Development', 'Marketing', 'Design', 'Finance'];

export const DEFAULT_PROJECT_COLORS: Record<string, string> = {
  'Development': '#3b82f6', // blue-500
  'Marketing': '#6366f1',   // indigo-500
  'Design': '#ec4899',      // pink-500
  'Finance': '#10b981',     // emerald-500
};

export const COLOR_PALETTE = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#64748b', // Slate
];