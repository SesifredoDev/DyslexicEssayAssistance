import { Component, NgZone } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCardModule, MatChipsModule, NgFor, 
    MatInputModule, MatButtonModule, MatIconModule, 
    DragDropModule, FormsModule 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DyslexicEssayAssistance';
  paragraphs: string[] = [];
  currentInput: string = "";
  recognition: any;
  isListening = false;

  constructor(private dialog: MatDialog, private ngZone: NgZone) {
    // Check if window and SpeechRecognition are available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-GB';

        this.recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          this.ngZone.run(() => {
            this.currentInput = transcript;
          });
        };

        this.recognition.onend = () => {
          this.ngZone.run(() => {
            this.isListening = false;
          });
        };
      }
    }
  }

  toggleSpeechRecognition() {
    if (this.recognition) {
      if (!this.isListening) {
        this.recognition.start();
        this.isListening = true;
      } else {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  }

  submit(event: any) {
    if (event === "") return;
    this.paragraphs.push(event);
    this.currentInput = "";
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.paragraphs, event.previousIndex, event.currentIndex);
  }

  exportToTxt() {
    const blob = new Blob([this.paragraphs.join("\n\n")], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "paragraphs.txt";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }
}
