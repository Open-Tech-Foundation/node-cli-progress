import { style } from '@open-tech-world/es-cli-styles';
import IOptions from './IOptions';

class cliProgress {
  private stream: NodeJS.WriteStream;
  private isRunning: boolean;
  private text: string;
  private tty;

  constructor(options: IOptions) {
    this.stream = (options && options.stream) || process.stderr;
    this.tty = this.stream.isTTY;
    this.isRunning = false;
    this.text = '';
  }

  private setText(text: string): void {
    if (!this.isRunning) {
      return;
    }

    if (text) {
      this.text = text + ' ';
    }
  }

  private render(text: string): void {
    if (this.tty) {
      if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
        this.stream.write(text);
      }
      return;
    }

    this.stream.write(text);
  }

  private startSpinner(): void {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let currentPosition = 0;
    const intervalInstance = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(intervalInstance);
        return;
      }

      this.render(
        style('~green.bold{' + frames[currentPosition] + '} ' + this.text)
      );

      if (currentPosition === frames.length - 1) {
        currentPosition = 0;
        return;
      }
      currentPosition++;
    }, 100);
  }

  start(text: string): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.setText(text || 'Loading');
    if (this.tty) {
      this.startSpinner();
      return;
    }

    this.render('\u{2B50} Loading\n');
  }

  update(text: string): void {
    this.setText(text);
    if (this.isRunning && !this.tty) {
      this.render('\u{2B50} ' + this.text + '\n');
    }
  }

  done(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.tty) {
      this.render(
        style('~green.bold{\u{2714}\u{FE0F}}') + '  ' + this.text + '\n'
      );
      return;
    }

    this.render('\u{2714} ' + this.text + '\n');
  }

  fail(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.tty) {
      this.render(
        style('~red.bold{\u{274C}\u{FE0F}}') + ' ' + this.text + '\n'
      );
      return;
    }

    this.render('\u{274C} ' + this.text + '\n');
  }

  warn(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.tty) {
      this.render(
        style('~yellow.bold{\u{26A0}\u{FE0F}}') + '  ' + this.text + '\n'
      );
      return;
    }

    this.render('\u{26A0} ' + this.text + '\n');
  }

  info(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;
    if (this.tty) {
      this.render(
        style('~aqua.bold{\u{2139}\u{FE0F}}') + '  ' + this.text + '\n'
      );
      return;
    }

    this.render('\u{2139} ' + this.text + '\n');
  }
}

export default cliProgress;
