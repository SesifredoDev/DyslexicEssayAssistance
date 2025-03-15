import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenAIService } from '../../shared/services/OpenAI/open-ai.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-choice-popup',
  templateUrl: './choice-popup.component.html',
  styleUrls: ['./choice-popup.component.css'],
  imports: [MatListModule, MatProgressSpinnerModule, MatDialogModule, NgFor, NgIf, MatCardModule]
})
export class ChoicePopupComponent implements OnInit {
  choices: string[] = [];
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<ChoicePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { input: string },
    private openAIService: OpenAIService
  ) {}

  async ngOnInit() {
    try {
      const response = await this.openAIService.aiFix(this.data.input);
      this.choices = response.split('\n').filter(choice => choice.trim() !== '');
    } catch (error) {
      console.error('Error fetching AI choices:', error);
      this.choices = ['Error fetching choices'];
    } finally {
      this.loading = false;
    }
  }

  selectChoice(choice: string) {
    this.dialogRef.close(choice);
  }
}
