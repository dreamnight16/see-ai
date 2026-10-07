'use client';

import CodeExercise from '@/components/exercise/CodeExercise';
import type { Exercise } from '@/lib/exercises';
import { recordExerciseCompleted } from '@/lib/progress';

interface LessonExercisesProps {
  exercises: Exercise[];
}

export default function LessonExercises({ exercises }: LessonExercisesProps) {
  function handleExerciseComplete(exerciseId: string) {
    // recordExerciseCompleted 里会顺带把游戏事件发出去
    recordExerciseCompleted(exerciseId);
  }

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <CodeExercise
          key={exercise.id}
          exercise={exercise}
          onComplete={handleExerciseComplete}
        />
      ))}
    </div>
  );
}
