export interface Task {
    id: string;
    projectId:string;
    title:string;
    assignee:string;
    dueDate:string;
    status:'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
}