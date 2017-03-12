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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUk5GU1Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9JbnRlZ3JhdGlvblRlc3RzL1JORlNUZXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBMkQ7QUFDM0QsdUNBQXVDO0FBQ3ZDLE9BQU8sS0FBSyxLQUFLLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQyxJQUFJLFlBQVksR0FBcUIsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUV0RCxJQUFJLEVBQ0YsSUFBSSxFQUNKLElBQUksRUFDSixhQUFhLEVBQ2QsR0FBRyxLQUFLLENBQUM7QUFDVixJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO0FBRTdDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUdsQiw2QkFBNkI7QUFDN0IsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLGFBQW9DLENBQUM7QUFFekMscUJBQXFCLFdBQW1CLEVBQUUsRUFBOEIsRUFBRSxJQUFnQjtJQUN4RixhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELG9CQUFvQixTQUFrQixFQUFFLE9BQWU7SUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0FBQ0gsQ0FBQztBQUVELHFCQUFxQixHQUFRLEVBQUUsR0FBUSxFQUFFLFFBQWdCO0lBQ3ZELFVBQVUsQ0FDUixHQUFHLEtBQUssR0FBRyxFQUNYLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxhQUFhLEdBQUcsR0FBRyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQ25FLENBQUM7QUFDSixDQUFDO0FBRUQseUJBQXlCLEdBQVU7SUFDakMsVUFBVSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUUsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCw4QkFBOEIsSUFBZ0I7SUFDNUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLHFCQUFxQixHQUFHLFdBQVcsQ0FBQztJQUU1RCxJQUFJLElBQUksR0FBRyw0QkFBNEIsQ0FBQztJQUN4QyxJQUFJLFFBQVEsQ0FBQztJQUViLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztTQUMvQixJQUFJLENBQUMsQ0FBQyxPQUFPO1FBQ1osYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxDQUFDLFFBQVE7UUFDYixhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN0QyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDcEQsYUFBYSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQztTQUNELE9BQU8sQ0FBQztRQUNQLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksRUFBRSxDQUFDO0lBQ1AsdUZBQXVGO0FBQzNGLENBQUM7QUFJRCxpQ0FBaUMsSUFBZ0I7SUFDL0MsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLHFCQUFxQixHQUFHLFdBQVcsQ0FBQztJQUM1RCxJQUFJLElBQUksR0FBRyw0QkFBNEIsQ0FBQztJQUN4QyxJQUFJLFFBQVEsQ0FBQztJQUViLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztTQUMvQixJQUFJLENBQUMsQ0FBQyxNQUE0QztRQUNqRCxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDO1NBQ0QsTUFBTSxDQUFDLENBQUMsT0FBZ0IsRUFBRSxJQUFZO1FBQ3JDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsQ0FBQyxVQUFlO1FBQ3BCLGFBQWEsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QixhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLENBQUMsR0FBVztRQUNqQixhQUFhLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUM7U0FDRCxPQUFPLENBQUM7UUFDUCxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQjtJQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUksRUFBRSxDQUFDLENBQUMsdUZBQXVGO0FBQ25HLENBQUM7QUFPRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUEyQjtJQUN2RCxlQUFlO1FBQ2IsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUM7SUFDSixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QixJQUFJLEVBQUUsSUFBSTtTQUNYLEVBQUUsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEMsYUFBYSxHQUFHLENBQUMsR0FBVztZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQzthQUNqRCxDQUFDLENBQUM7WUFDSCxLQUFLLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUM7UUFDRixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sQ0FBQyxDQUNMLG9CQUFDLElBQUksSUFBQyxLQUFLLEVBQUUsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7WUFDcEQsb0JBQUMsSUFBSTtnQkFDRixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsWUFBWTtnQkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUN4QixDQUNGLENBQ1IsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyJ9