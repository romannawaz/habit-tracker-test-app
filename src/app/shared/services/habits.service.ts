import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IHabit } from '../interfaces/habit.interface';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  private habitsList: IHabit[] = [];

  private habitsSubject = new BehaviorSubject<IHabit[]>(this.habitsList);

  constructor() {
    if (localStorage.getItem('habitList')) {
      this.habitsList = JSON.parse(localStorage.getItem('habitList'));

      this.setNextStep();
    }
  }

  getHabitsChanges(): Observable<IHabit[]> {
    return this.habitsSubject.asObservable();
  }

  getHabitByIndex(index: number): IHabit {
    return this.habitsList[index];
  }

  addHabit(habit: IHabit): void {
    this.habitsList.push(Object.assign({}, habit));

    this.setNextStep();
  }

  editHabit(index: number, habit: IHabit): void {
    this.habitsList.splice(index, 1, habit);

    this.setNextStep();
  }

  deleteHabit(index: number): void {
    this.habitsList.splice(index, 1);

    this.setNextStep();
  }

  changeHabitStatus(index: number): void {
    let habit = this.habitsList[index];
    habit.status = !habit.status;

    this.habitsList.splice(index, 1, habit);

    this.setNextStep();
  }

  resetAllHabits(): void {
    this.habitsList.forEach(el => {
      el.status = false;
    });

    this.setNextStep();
  }

  changeHabitPosition(event: CdkDragDrop<IHabit[]>): void {
    moveItemInArray(this.habitsList, event.previousIndex, event.currentIndex);

    this.setNextStep();
  }

  private setNextStep(): void {
    localStorage.setItem('habitList', JSON.stringify(this.habitsList));

    this.habitsSubject.next(this.habitsList);
  }
}
