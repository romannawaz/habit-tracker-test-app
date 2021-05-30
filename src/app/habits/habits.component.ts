import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { IHabit } from '../shared/interfaces/habit.interface';
import { Habit } from '../shared/models/habit.model';
import { HabitsService } from '../shared/services/habits.service';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.scss']
})
export class HabitsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['title', 'status', 'edit', 'delete'];

  habitsList: IHabit[] = [];

  habitForm: FormGroup = new FormGroup({
    habitTitle: new FormControl('', { validators: [Validators.required] })
  });

  chartDatasets: Array<any> = [];
  chartColors: Array<any> = [
    {
      backgroundColor: ['#3f51b5', 'transparent'],
      borderWidth: 0,
    }
  ];

  editStatus: boolean;
  editHabitIndex: number;

  private habitListSubscribe: Subscription;

  constructor(
    private habitsService: HabitsService
  ) { }

  ngOnInit(): void {
    this.habitListSubscribe = this.habitsService.getHabitsChanges()
      .subscribe(habits => {
        this.habitsList = [...habits];

        this.countingCompletedHabits();
      });
  }

  ngOnDestroy(): void {
    this.habitListSubscribe.unsubscribe();
  }

  addNewHabit(): void {
    if (this.habitForm.valid) {
      let newHabit: IHabit = new Habit(this.habitForm.value.habitTitle);

      if (this.editStatus) {
        this.habitsService.editHabit(this.editHabitIndex, newHabit);

        this.editStatus = false;
        this.editHabitIndex = null;
      }
      else {
        this.habitsService.addHabit(newHabit);
      }
    }
  }

  editHabit(index: number): void {
    this.editStatus = true;
    this.editHabitIndex = index;

    let { title } = this.habitsService.getHabitByIndex(index);

    this.habitForm.setValue({ habitTitle: title });
  }

  deleteHabit(index: number): void {
    this.habitsService.deleteHabit(index);
  }

  changeStatus(index: number): void {
    this.habitsService.changeHabitStatus(index);
  }

  drop(event: CdkDragDrop<IHabit[]>) {
    this.habitsService.changeHabitPosition(event);
  }

  countingCompletedHabits() {
    let completedHabits = 0;
    let uncompletedHabits = 0;

    this.habitsList.forEach(el => {
      if (el.status)
        completedHabits++;
      else
        uncompletedHabits++;
    });

    this.chartDatasets = [
      { data: [completedHabits, uncompletedHabits] }
    ];
  }

  resetAllHabits(): void {
    this.habitsService.resetAllHabits();

    this.countingCompletedHabits();
  }

  resetForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();

    this.habitForm.reset();
  }

}
