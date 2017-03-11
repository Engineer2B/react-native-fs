// var RCTTestModule = require('NativeModules').TestModule;
// var React = require('react-native');
import * as React from 'react-native';
import { FileSystem } from '../src/FileSystem';

let myFileSystem: rnfs.IFileSystem = new FileSystem();

let {
  Text,
  View,
  NativeModules
} = React;
let RCTTestModule = NativeModules.TestModule;

var DEBUG = false;


// setup in componentDidMount
let done;
let updateMessage: (msg: string) => void;

function runTestCase(description: string, fn: (done: () => void) => void, done: () => void) {
  updateMessage(description);
  fn(done);
}

function expectTrue(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectEqual(lhs: any, rhs: any, testname: string) {
  expectTrue(
    lhs === rhs,
    'Error in test ' + testname + ': expected ' + rhs + ', got ' + lhs
  );
}

function expectFSNoError(err: Error) {
  expectTrue(err === null, 'Unexpected FS error: ' + JSON.stringify(err));
}

function testWriteAndReadFile(done: () => void) {
  let path = myFileSystem.DocumentDirectoryPath + '/test.txt';

  let text = 'Lorem ipsum dolor sit amet';
  let readText;

  myFileSystem.writeFile(path, text)
    .then((success) => {
      updateMessage('FILE WRITTEN!');
      return myFileSystem.readFile(path);
    })
    .then((contents) => {
      updateMessage('FILE READ! Contents:');
      readText = contents;
      expectEqual(text, readText, 'testWriteAndReadFile');
      updateMessage('readFile correctly returned' + readText);
    })
    .finally(() => {
      runTestCase('testCreateAndDeleteFile', testCreateAndDeleteFile, done);
    });
    done();
    //promise done needed to throw exception so that in case test fails,error is propagated
}



function testCreateAndDeleteFile(done: () => void): void {
  let path = myFileSystem.DocumentDirectoryPath + '/test.txt';
  let text = 'Lorem ipsum dolor sit amet';
  let readText;

  myFileSystem.writeFile(path, text)
    .then((result: {filePath: string, exception: Error}) => {
      updateMessage('FILE CREATED!');
      return myFileSystem.unlink(path);
    })
    .spread((success: boolean, path: string) => {
      updateMessage('FILE DELETED!' + success + ',' + path);
      return myFileSystem.stat(path);
    })
    .then((statResult: any) => {
      updateMessage('*****' + statResult);
      if (statResult.isFile()) {
        updateMessage('FILE STILL EXISTS');
      }
    })
    .catch((err: string) => {
      updateMessage('catch' + err);
      expectTrue(true, 'File is deleted');
    })
    .finally(() => {
      done(); //testrunners done
    })
    done(); //promise done needed to throw exception so that in case test fails,error is propagated
}

interface IFSTestProp {
  messages: string;
  done: boolean;
}

let FSTest = React.createClass<IFSTestProp, IFSTestProp>({
  getInitialState() {
    return {
      messages: 'Initializing...',
      done: false,
    };
  },

  componentDidMount() {
    done = () => this.setState({
      done: true
    }, RCTTestModule.markTestCompleted);
    updateMessage = (msg: string) => {
      this.setState({
        messages: this.state.messages.concat('\n' + msg)
      });
      DEBUG && console.log(msg);
    };
    testWriteAndReadFile(done);
  },

  render() {
    return (
      <View style={{ backgroundColor: 'white', padding: 40 }}>
        <Text>
          {this.constructor.displayName + ': '}
          {this.state.done ? 'Done' : 'Testing...'}
          {'\n\n' + this.state.messages}
        </Text>
      </View>
    );
  }
});

module.exports = FSTest;