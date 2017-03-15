// var RCTTestModule = require('NativeModules').TestModule;
// var React = require('react-native');
import * as React from 'react-native';
import { FileSystem } from '../src/FileSystem';
let myFileSystem = new FileSystem();
let { Text, View, NativeModules } = React;
let RCTTestModule = NativeModules.TestModule;
var DEBUG = false;
// setup in componentDidMount
let done;
let updateMessage;
function runTestCase(description, fn, done) {
    updateMessage(description);
    fn(done);
}
function expectTrue(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
function expectEqual(lhs, rhs, testname) {
    expectTrue(lhs === rhs, 'Error in test ' + testname + ': expected ' + rhs + ', got ' + lhs);
}
function expectFSNoError(err) {
    expectTrue(err === null, 'Unexpected FS error: ' + JSON.stringify(err));
}
function testWriteAndReadFile(done) {
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
function testCreateAndDeleteFile(done) {
    let path = myFileSystem.DocumentDirectoryPath + '/test.txt';
    let text = 'Lorem ipsum dolor sit amet';
    let readText;
    myFileSystem.writeFile(path, text)
        .then((result) => {
        updateMessage('FILE CREATED!');
        return myFileSystem.unlink(path);
    })
        .spread((success, path) => {
        updateMessage('FILE DELETED!' + success + ',' + path);
        return myFileSystem.stat(path);
    })
        .then((statResult) => {
        updateMessage('*****' + statResult);
        if (statResult.isFile()) {
            updateMessage('FILE STILL EXISTS');
        }
    })
        .catch((err) => {
        updateMessage('catch' + err);
        expectTrue(true, 'File is deleted');
    })
        .finally(() => {
        done(); //testrunners done
    });
    done(); //promise done needed to throw exception so that in case test fails,error is propagated
}
let FSTest = React.createClass({
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
        updateMessage = (msg) => {
            this.setState({
                messages: this.state.messages.concat('\n' + msg)
            });
            DEBUG && console.log(msg);
        };
        testWriteAndReadFile(done);
    },
    render() {
        return (React.createElement(View, { style: { backgroundColor: 'white', padding: 40 } },
            React.createElement(Text, null,
                this.constructor.displayName + ': ',
                this.state.done ? 'Done' : 'Testing...',
                '\n\n' + this.state.messages)));
    }
});
module.exports = FSTest;
