import { style } from '@open-tech-world/es-cli-styles';

class cliProgress {
  stream: NodeJS.WriteStream;
  isRunning: boolean;
  text: string;

  constructor(stream: NodeJS.WriteStream) {
    this.stream = stream || process.stderr;
    this.isRunning = false;
    this.text = 'Loading';
  }

  start(text: string): void {
    if (text) {
      this.text = text;
    }
    this.isRunning = true;
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
    if (this.isRunning) {
      this.text = text;
    }
  }

  done(text: string): void {
    if (text) {
      this.text = text;
    }
    this.isRunning = false;
    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('✔️  ' + this.text + '\n');
    }
  }

  fail(text: string): void {
    if (text) {
      this.text = text;
    }
    this.isRunning = false;
    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('❌ ' + this.text + '\n');
    }
  }

  warn(text: string): void {
    if (text) {
      this.text = text;
    }
    this.isRunning = false;
    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('⚠️  ' + this.text + '\n');
    }
  }

  info(text: string): void {
    if (text) {
      this.text = text;
    }
    this.isRunning = false;
    if (this.stream.clearLine(0) && this.stream.cursorTo(0)) {
      this.stream.write('ℹ️  ' + this.text + '\n');
    }
  }
}

export default cliProgress;
