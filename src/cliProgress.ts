import { style } from '@open-tech-world/es-cli-styles';

class cliProgress {
  private stream: NodeJS.WriteStream;
  private isRunning: boolean;
  private text: string;

  constructor(stream: NodeJS.WriteStream) {
    this.stream = stream || process.stderr;
    this.isRunning = false;
    this.text = 'Loading ';
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
    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write(text);
    }
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
    this.isRunning = true;
    this.setText(text);
    this.startSpinner();
  }

  update(text: string): void {
    this.setText(text);
  }

  done(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;
    this.render(style('~green.bold{✔️}  ') + this.text + '\n');
  }

  fail(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;
    this.render(style('~red.bold{❌} ') + this.text + '\n');
  }

  warn(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;
    this.render(style('~yellow.bold{⚠️}  ') + this.text + '\n');
  }

  info(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;
    this.render(style('~aqua.bold{ℹ️}  ') + this.text + '\n');
  }
}

export default cliProgress;
