'use client';

import CodeExercise from '@/components/exercise/CodeExercise';
import type { Exercise } from '@/lib/exercises';
import { emitGameEvent } from '@/lib/events';

interface LessonExercisesProps {
  exercises: Exercise[];
}

export default function LessonExercises({ exercises }: LessonExercisesProps) {
  function handleExerciseComplete(exerciseId: string) {
    emitGameEvent({ type: 'exercise:completed', exerciseId });
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
