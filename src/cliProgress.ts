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

  start(text: string): void {
    this.isRunning = true;
    this.setText(text);
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let currentPosition = 0;
    const intervalInstance = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(intervalInstance);
        return;
      }

      this.stream.cursorTo(0);
      this.stream.write(
        style('~green.bold{' + frames[currentPosition] + '} ' + this.text)
      );
      if (currentPosition === frames.length - 1) {
        currentPosition = 0;
        return;
      }
      currentPosition++;
    }, 100);
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

    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('✔️  ' + this.text + '\n');
    }
  }

  fail(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('❌ ' + this.text + '\n');
    }
  }

  warn(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('⚠️  ' + this.text + '\n');
    }
  }

  info(text: string): void {
    if (!this.isRunning) {
      return;
    }

    this.setText(text);
    this.isRunning = false;

    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('ℹ️  ' + this.text + '\n');
    }
  }
}

export default cliProgress;
