export interface Project {
    id: string;
    name: string;
    owner: string;
    status: 'Active' | 'Completed' | 'On Hold';
    description: string;
    tasks: any[];
}