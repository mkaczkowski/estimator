/**
 * TypeScript type definitions for the Estimator Generator
 * These types define the JSON input format for project estimations
 */

/**
 * Story points can be a single number or a range
 */
export type StoryPoints = number | { min: number; max: number };

/**
 * Risk level for a task
 */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Dependency can be a simple task ID string or an object with description
 */
export type TaskDependency = string | {
    taskId: string;
    description?: string;
};

/**
 * Risk information for a task
 */
export interface TaskRisk {
    level: RiskLevel;
    description?: string;
}

/**
 * A single task within a phase
 */
export interface Task {
    /** Task ID in format "X.Y" (e.g., "1.1", "2.3") */
    id: string;
    /** Task title/name */
    title: string;
    /** Story points - single number or range */
    storyPoints: StoryPoints;
    /** Task description (supports Markdown) */
    description?: string;
    /** List of deliverables */
    deliverables?: string[];
    /** List of acceptance criteria */
    acceptanceCriteria?: string[];
    /** Dependencies on other tasks */
    dependencies?: TaskDependency[];
    /** Risk assessment */
    risk?: TaskRisk;
}

/**
 * A project phase containing multiple tasks
 */
export interface Phase {
    /** Phase number (1, 2, 3, etc.) */
    id: number;
    /** Phase title/name */
    title: string;
    /** Phase objective or goal */
    objective?: string;
    /** Tasks within this phase */
    tasks: Task[];
}

/**
 * Root structure for estimator data
 */
export interface EstimatorData {
    /** Project title displayed in the header */
    title: string;
    /** Optional project description or overview */
    description?: string;
    /** Project phases containing tasks */
    phases: Phase[];
}
