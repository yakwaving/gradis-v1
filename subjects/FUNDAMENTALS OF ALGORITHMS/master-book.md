# Fundamentals of Algorithm: Master Book

Built-in functions, data types and declarations · Software Engineering, Level I

## How to use this book

- Every entry says what it does, how to write it, a short example and the trap to avoid.
- Each idea is shown twice: first as an algorithm (pseudocode), then in Pascal.
- The listings are complete, corrected versions of the course examples. The last section lists the typos that were fixed.
- Pascal is not case-sensitive: `WriteLn`, `writeln` and `WRITELN` are the same word.

## 1. Program structure

Every algorithm has three parts: a name, a declarative part and a body. A Pascal program follows the same plan.

| Part | Pseudocode | Pascal |
|---|---|---|
| Name | ALGORITHM CalculateAverage | program CalculateAverage; |
| Libraries | (none) | uses crt, math; |
| Constants | CONST coef1 ← 3 | const coef1 = 3; |
| Types | TYPE Student = RECORD … | type Student = record … end; |
| Variables | Declare avg As Real | var avg: real; |
| Subprograms | Procedure / Function | procedure / function |
| Body | Start … Stop | begin … end. |

The order in Pascal is always: program, uses, const, type, var, subprograms, then the main begin … end.

```pascal
program CalculateAverage;
uses crt;
const
  coef1 = 3; coef2 = 2; coef3 = 5;
var
  grade1, grade2, grade3, avg: real;
begin
  ClrScr;
  writeln('Enter three grades: ');
  readln(grade1, grade2, grade3);
  avg := (grade1 * coef1 + grade2 * coef2 + grade3 * coef3)
         / (coef1 + coef2 + coef3);
  writeln('The average is: ', avg:0:2);
  ReadKey;
end.
```

**Rules to remember**

- A semicolon ends a statement. The program ends with `end.` (with a dot).
- Comments go between braces `{ like this }` or after `//`.
- Assignment is `:=` in Pascal and `←` in pseudocode. A single `=` is a comparison.
- A block of several statements needs `begin … end`.

## 2. Data types

A data type tells the computer what kind of value a variable holds and how much memory it needs. All data is stored as bytes.

### 2.1 Simple types

| Type | Holds | Example | Range or limit |
|---|---|---|---|
| Integer | whole numbers | 10, -3 | -32,768 to 32,767 |
| Longint | large whole numbers | 100000 | -2,147,483,648 to 2,147,483,647 |
| Int64 | very large whole numbers | 5000000000 | about -9.2 × 10^18 to 9.2 × 10^18 |
| Byte | small unsigned whole numbers | 200 | 0 to 255 |
| Word | unsigned whole numbers | 40000 | 0 to 65,535 |
| Longword | large unsigned whole numbers | 3000000000 | 0 to 4,294,967,295 |
| Real | decimal numbers | 3.14 | mantissa and exponent |
| Single | decimal numbers, about 7 digits | 2.5 | 1.40 × 10^-45 to 3.40 × 10^38 |
| Double | decimal numbers, about 15 digits | 2.5 | 4.94 × 10^-324 to 1.79 × 10^308 |
| Boolean | True or False | True | two values only |
| Char | one character | 'A' | one byte, an ASCII code |
| String | text | 'Hello' | up to 255 characters |

**Notes**

- Integer is the 16-bit type used in this course. A value above 32,767 overflows it: use Longint or Int64.
- `string[50]` is a string limited to 50 characters. A plain `string` holds up to 255.
- A Char is written between single quotes: `'A'`. A String is also written between single quotes: `'Hello'`.
- In AlgoBox the three types are NUMBER, LIST and STRING.

### 2.2 Structured types

| Type | Holds | Fields or cells |
|---|---|---|
| Array | many values of the same type | accessed by an index |
| Record | several values of different types about one entity | accessed by field name |
| File | a set of records stored on disk | read and written in order |

### 2.3 Data structure families

- **Primitive:** integer, character, boolean.
- **Non-primitive, linear:** arrays, stacks, queues, linked lists.
- **Non-primitive, non-linear:** trees, graphs, sets, tables.

Six operations are performed on a data structure: **traversal** (visit each element once), **search**, **insertion**, **deletion**, **sorting** and **merging** (combine two sorted files into one sorted file).

## 3. Declaring constants, variables and types

### 3.1 Constants

A constant holds a value that can never change.

| Pseudocode | Pascal |
|---|---|
| CONST Pi ← 3.14159 | const Pi = 3.14159; |
| CONST Letter ← 'F' | const Letter = 'F'; |

**Trap:** a constant uses `=` and cannot be assigned again. `Pi := 3;` is an error.

### 3.2 Variables

A variable holds a value that can change: an input, an intermediate result or a final result.

| Pseudocode | Pascal |
|---|---|
| Declare age As Integer | var age: integer; |
| Declare price As Real | var price: real; |
| Declare initial As Character | var initial: char; |
| Declare studentName As String | var studentName: string; |
| Declare found As Boolean | var found: boolean; |
| Declare a, b As Integer | var a, b: integer; |
| Let total ← 0 | total := 0; |

**Trap:** a variable that is not initialised holds an unknown value. Set accumulators and counters to 0 before you use them.

### 3.3 User-defined types

| Pseudocode | Pascal |
|---|---|
| TYPE Marks = ARRAY [1..10] OF Real | type Marks = array[1..10] of real; |
| TYPE Student = RECORD … END RECORD | type Student = record … end; |
| TYPE StaffFile = FILE OF Person | type StaffFile = file of Person; |

Declare the type first, then declare variables of that type in the `var` section.

### 3.4 Rules for identifiers

An identifier is the name of a constant, variable, type or function.

- It starts with a letter or an underscore, then letters, digits or underscores.
- It has no spaces and no symbols such as `-` or `.`
- It cannot be a reserved word such as `begin`, `end`, `var`, `array` or `record`.
- Choose meaningful names: `height` and `width`, not `h` and `w`.

Valid: `Conversion_BCD`, `Result`, `Letter`, `total2`. Invalid: `2nd_grade`, `my var`, `total-pay`, `begin`.

## 4. Operators and expressions

| Kind | Pascal | Meaning |
|---|---|---|
| Arithmetic | `+`  `-`  `*` | add, subtract, multiply |
| Arithmetic | `/` | division, the result is always real |
| Arithmetic | `div` | whole-number quotient |
| Arithmetic | `mod` | remainder of whole-number division |
| Comparison | `=`  `<>`  `<`  `>`  `<=`  `>=` | equal, different, smaller, greater, and so on |
| Logical | `and`  `or`  `xor`  `not` | AND, OR, exclusive OR, NOT |
| Strings | `+` | joins two strings |
| Assignment | `:=` | stores a value in a variable |

**Examples:** `17 div 5` gives 3, `17 mod 5` gives 2, `17 / 5` gives 3.4, and `'Hel' + 'lo'` gives `'Hello'`.

**Order of evaluation, from first to last**

1. `not`
2. `*`  `/`  `div`  `mod`  `and`
3. `+`  `-`  `or`  `xor`
4. `=`  `<>`  `<`  `>`  `<=`  `>=`

Use parentheses in every complex expression.

**Traps**

- `if x > 0 and y > 0` is an error, because `and` is evaluated before `>`. Write `if (x > 0) and (y > 0)`.
- `/` always gives a real result. Storing it in an integer variable is an error. Use `div` for a whole-number result.
- Pascal has no power operator. `x**2` and `x^2` do not exist: use `sqr(x)` or `power(x, 2)`.
- The symbols `%`, `//` and `+=` seen in some tables are not Pascal. Use `mod`, `div` and `x := x + 1`.

**Conditions.** A simple condition is `x <> 0`. A complex condition combines simple ones: `(x > 0) and ((y > 0) or (z > 0))`, or `(index >= 1) and (index <= 10)` for 1 ≤ index ≤ 10.

## 5. Built-in procedures and functions

A built-in routine is ready-made: you do not write its body. Some need a unit, which you load with `uses`.

| | Function | Procedure |
|---|---|---|
| Returns a value | yes | no |
| Used | inside an expression: `x := sqrt(16);` | as a statement: `writeln('Hi');` |

### 5.1 Input and output

| Pseudocode | Pascal | What it does |
|---|---|---|
| Display(x), Write(x) | `write(x)` | shows x and stays on the same line |
| Display(x) | `writeln(x)` | shows x, then moves to the next line |
| Read(x), Input(x) | `read(x)` | reads a value into x |
| Read(x) | `readln(x)` | reads a value, then skips to the next line |

```pascal
write('Enter your name: ');
readln(name);
writeln('Hello, ', name, '!');
```

If the user types Ana, the screen shows `Hello, Ana!`

- `readln(a, b)` reads two values, which the user separates with a space or Enter.
- You can mix text and variables in one call, separated by commas.
- **Formatting numbers:** `x:width:decimals`. `writeln(3.14159:0:2)` shows `3.14`, and `writeln(5:4)` shows `   5`. A real number written without a format appears in scientific notation, such as `3.1400000000E+00`.
- **Trap:** a quote inside a string is written twice: `'student''s name'`. A single quote ends the string early.

### 5.2 The CRT unit (`uses crt;`)

| Routine | Kind | What it does | Example |
|---|---|---|---|
| `ClrScr` | procedure | clears the screen | `ClrScr;` |
| `ReadKey` | function (Char) | waits for a key and returns it | `c := ReadKey;` |
| `Delay(ms)` | procedure | pauses for ms milliseconds | `Delay(2000);` waits 2 seconds |
| `KeyPressed` | function (Boolean) | True when a key has been pressed | `while not KeyPressed do …` |

**Trap:** `ClrScr`, `ReadKey` and `Delay` fail with an unknown identifier error if you forget `uses crt;`.

### 5.3 Math routines

These are in the base language, apart from the ones marked **Math**, which need `uses math;`.

| Routine | What it does | Example | Result |
|---|---|---|---|
| `abs(x)` | absolute value | `abs(-7)` | 7 |
| `sqr(x)` | x squared | `sqr(5)` | 25 |
| `sqrt(x)` | square root, real result, x ≥ 0 | `sqrt(81)` | 9.0 |
| `trunc(x)` | cuts off the decimals | `trunc(2.9)` and `trunc(-2.9)` | 2 and -2 |
| `round(x)` | nearest whole number | `round(2.6)` | 3 |
| `int(x)` | whole part, kept as a real | `int(2.9)` | 2.0 |
| `frac(x)` | decimal part | `frac(2.75)` | 0.75 |
| `odd(n)` | True if n is odd | `odd(7)` | True |
| `succ(n)`, `pred(n)` | next and previous value | `succ(5)`, `pred('B')` | 6, 'A' |
| `inc(n)`, `inc(n, k)` | adds 1 or k to a variable | `inc(i);` | same as `i := i + 1` |
| `dec(n)`, `dec(n, k)` | subtracts 1 or k from a variable | `dec(i, 2);` | same as `i := i - 2` |
| `random(n)` | random whole number from 0 to n - 1 | `random(101)` | 0 to 100 |
| `random` | random real from 0 up to, but not including, 1 | `random` | 0.4172… |
| `randomize` | changes the random sequence each run | `randomize;` | call it once, at the start |
| `pi` | the constant π | `pi` | 3.14159… |
| `power(x, y)` **Math** | x to the power y | `power(2, 10)` | 1024.0 |
| `ceil(x)`, `floor(x)` **Math** | round up and round down | `ceil(2.1)`, `floor(2.9)` | 3, 2 |
| `max(a, b)`, `min(a, b)` **Math** | larger and smaller of two values | `max(4, 9)` | 9 |

```pascal
program MathDemo;
uses math;
var
  x: real;
begin
  x := 17.6;
  writeln(trunc(x));            { 17 }
  writeln(round(x));            { 18 }
  writeln(frac(x):0:1);         { 0.6 }
  writeln(sqrt(81):0:1);        { 9.0 }
  writeln(power(2, 10):0:0);    { 1024 }
  writeln(17 div 5, ' ', 17 mod 5);  { 3 2 }
  writeln(random(6) + 1);       { a dice roll, 1 to 6 }
end.
```

**Traps**

- `sqrt`, `power` and `frac` return reals. `i := sqrt(x);` is an error when i is an integer. Write `i := trunc(sqrt(x));`.
- `sqrt` of a negative number stops the program. Test the value first: `if x >= 0 then …`
- `round` and `trunc` return whole numbers. In Free Pascal, `round` sends an exact half to the nearest even number, so `round(2.5)` is 2 and `round(3.5)` is 4.
- `random(n)` never returns n. For 1 to n, write `random(n) + 1`.

### 5.4 Characters and conversions

| Routine | What it does | Example | Result |
|---|---|---|---|
| `ord(c)` | ASCII code of a character | `ord('A')` | 65 |
| `chr(n)` | character with that code | `chr(97)` | 'a' |
| `upcase(c)` | a character in capital letters | `upcase('b')` | 'B' |
| `str(n, s)` | number to string | `str(250, s)` | s is '250' |
| `val(s, n, code)` | string to number | `val('42', n, code)` | n is 42, code is 0 |
| `IntToStr(n)` **SysUtils** | number to string | `IntToStr(250)` | '250' |
| `StrToInt(s)` **SysUtils** | string to number | `StrToInt('42')` | 42 |

To turn a digit character into its value, write `ord('7') - ord('0')`, which gives 7.

**Trap:** after `val`, always check that `code` is 0. Any other value means the text was not a valid number, and code holds the position of the first wrong character.

### 5.5 String routines

Characters are numbered from 1: with `s := 'Algorithm'`, `s[1]` is 'A' and `s[9]` is 'm'.

| Routine | What it does | Example | Result |
|---|---|---|---|
| `length(s)` | number of characters | `length('Algorithm')` | 9 |
| `copy(s, start, count)` | a piece of the string | `copy('Algorithm', 1, 4)` | 'Algo' |
| `pos(sub, s)` | position of the first match, 0 if absent | `pos('rith', 'Algorithm')` | 5 |
| `concat(a, b)` or `a + b` | joins strings | `'Al' + 'go'` | 'Algo' |
| `delete(s, start, count)` | removes characters from s | `delete(s, 1, 4)` | s is 'rithm' |
| `insert(sub, s, start)` | inserts text into s | `insert('Big ', s, 1)` | s is 'Big Algorithm' |
| `UpperCase(s)` **SysUtils** | all capitals | `UpperCase('abc')` | 'ABC' |
| `LowerCase(s)` **SysUtils** | all lower case | `LowerCase('ABC')` | 'abc' |
| `Trim(s)` **SysUtils** | removes spaces at both ends | `Trim('  hi ')` | 'hi' |

Exercise from the course: count the vowels of a word of at most 10 letters.

```pascal
program CountVowels;
var
  w: string[10];
  i, count: integer;
begin
  write('Enter a word (10 letters at most): ');
  readln(w);
  count := 0;
  for i := 1 to length(w) do
    if upcase(w[i]) in ['A', 'E', 'I', 'O', 'U'] then
      inc(count);
  writeln('Number of vowels: ', count);
end.
```

The word `in` tests whether a value belongs to a list written between square brackets.

**Traps:** `delete` and `insert` are procedures that change the variable itself, so they cannot be used inside `writeln`. `copy` is a function and can.

### 5.6 File routines

| Routine | What it does |
|---|---|
| `assign(f, 'name.txt')` | links the file variable f to a file on disk |
| `rewrite(f)` | creates the file for writing, and erases any existing content |
| `reset(f)` | opens an existing file for reading |
| `append(f)` | opens a text file to add lines at the end |
| `write(f, …)`, `writeln(f, …)` | writes to the file |
| `read(f, …)`, `readln(f, …)` | reads from the file |
| `eof(f)` | True when the end of the file is reached |
| `close(f)` | closes the file |

The full method, with examples, is in the section on files.

### 5.7 Array helpers

- `low(a)` is the first index and `high(a)` is the last index of an array. With `var t: array[1..5] of integer;`, `low(t)` is 1 and `high(t)` is 5.
- Write `for i := low(t) to high(t) do` and the loop adapts when the size changes.

### 5.8 I want to… (quick lookup)

| I want to… | Use |
|---|---|
| show text | `writeln('text')` |
| read a number | `readln(n)` |
| clear the screen | `ClrScr` (crt) |
| wait 3 seconds | `Delay(3000)` (crt) |
| wait for a key | `ReadKey` (crt) |
| find a square root | `sqrt(x)` |
| square a number | `sqr(x)` |
| raise to a power | `power(x, y)` (math) |
| remove the decimals | `trunc(x)` |
| round a number | `round(x)` |
| get the remainder | `a mod b` |
| get the whole quotient | `a div b` |
| test odd or even | `odd(n)` or `n mod 2 = 0` |
| roll a dice | `random(6) + 1` |
| count characters | `length(s)` |
| cut part of a text | `copy(s, start, count)` |
| find a word in a text | `pos(word, s)` |
| make a letter a capital | `upcase(c)` |
| turn a number into text | `str(n, s)` or `IntToStr(n)` |
| turn text into a number | `val(s, n, code)` or `StrToInt(s)` |

## 6. Functions and procedures you write

### 6.1 Function or procedure?

| | Function | Procedure |
|---|---|---|
| Returns a value | yes, exactly one | no |
| How it is called | inside an expression: `r := Sum(3, 4);` | as a statement: `WelcomeMessage('Ana');` |
| Role | calculates and returns a result | performs actions: display, change, organise |
| Result is set by | `FunctionName := value;` | nothing to return |

Subprograms give three benefits: **reusability** (no repeated code), **modularity** (a big problem becomes small tasks) and **clarity** (readable, maintainable code). A subprogram cannot run alone: the main program, or another subprogram, calls it. In pseudocode the instruction is `Call`.

### 6.2 Syntax

Pseudocode, as in the course:

```text
Function FunctionName (parameters) Returns Type
Begin
  Constant ~ local constants ~
  Variable ~ local variables ~
  Instructions
  Return value
End Function

Procedure ProcedureName (parameters)
Begin
  Instructions
End Procedure
```

Pascal:

```pascal
function Name(a, b: integer): integer;
var
  local: integer;
begin
  Name := a + b;        { the result goes into the function name }
end;

procedure Name(text: string; var result: integer);
begin
  { statements }
end;
```

- Subprograms are written after the global `var` section and before the main `begin`.
- In Pascal there is no `Return`. You assign the result to the function name, and the function stops at its `end;`.
- Parameters of the same type can share one declaration: `(a, b: integer)`. Parameters of different types are separated by a semicolon: `(a: integer; x: real)`.

### 6.3 Value parameters and var parameters

| | Value parameter | var parameter |
|---|---|---|
| Written | `(x: integer)` | `(var x: integer)` |
| What the subprogram gets | a copy | the variable itself |
| Does a change reach the caller? | no | yes |
| What you can pass | a value, a variable or an expression | a variable only |

The course exercise: swap two variables, with a = 3 and b = 7 at the start.

```pascal
program SwapDemo;
var
  a, b: integer;

procedure Swap(var x, y: integer);
var
  temp: integer;
begin
  temp := x;
  x := y;
  y := temp;
end;

begin
  a := 3;
  b := 7;
  Swap(a, b);
  writeln('a = ', a, ', b = ', b);   { a = 7, b = 3 }
end.
```

**Traps:** without `var`, the swap happens on copies and nothing changes in the main program. Without the `temp` variable, one of the two values is lost.

### 6.4 Worked examples

```pascal
program SubprogramDemo;
const
  PI = 3.14;
var
  num1, num2: integer;
  userName: string;

function Sum(a, b: integer): integer;
begin
  Sum := a + b;
end;

function GetCircumference(radius: real): real;
begin
  GetCircumference := 2 * PI * radius;
end;

procedure DisplayArea(radius: real);
begin
  writeln('Area is: ', PI * radius * radius:0:2);
end;

procedure WelcomeMessage(name: string);
begin
  writeln('Hello, ', name, '!');
end;

begin
  write('Enter two numbers: ');
  readln(num1, num2);
  writeln('The sum is: ', Sum(num1, num2));
  writeln('Circumference: ', GetCircumference(5):0:2);   { 31.40 }
  DisplayArea(5);                                          { Area is: 78.50 }
  write('Enter your name: ');
  readln(userName);
  WelcomeMessage(userName);
end.
```

The matching pseudocode for the circumference:

```text
Algorithm CircumferenceCalculation
Function GetCircumference(radius) Returns Real
Begin
  Constant PI ← 3.14
  Return 2 * PI * radius
End Function
Start
  Let r ← 5
  Let c ← GetCircumference(r)
  Output 'Circumference is: ', c
Stop
```

### 6.5 Local and global variables

- A **local** variable is declared inside a subprogram. It exists only while the subprogram runs, and two subprograms can use the same local name without clashing.
- A **global** variable is declared before the subprograms. Every part of the program can read and change it, which makes errors harder to find. Prefer parameters.

### 6.6 Recursion

A recursive subprogram calls itself on a smaller problem. It needs two things: a **base case** that stops the calls, and a **recursive case** that moves towards the base case.

Factorial: Fact(N) = 1 if N = 0, and Fact(N) = N × Fact(N - 1) otherwise.

```text
Fact(3) = 3 * Fact(2) = 3 * 2 * Fact(1) = 3 * 2 * 1 * Fact(0) = 3 * 2 * 1 * 1 = 6
```

```pascal
function Fact(n: integer): longint;
begin
  if n = 0 then
    Fact := 1
  else
    Fact := n * Fact(n - 1);
end;
```

The loop version does the same job:

```pascal
factorial := 1;
for i := 1 to n do
  factorial := factorial * i;
```

**Trap: overflow.** With a 16-bit Integer, 8! = 40,320 is already too large. A Longint holds up to 12!, and an Int64 up to 20!. Declare the result type with the size you need.

Fibonacci: F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2) for n > 1. The sequence is 0, 1, 1, 2, 3, 5, 8, 13, 21, 34…

```pascal
function Fibonacci(n: integer): longint;
begin
  if n = 0 then
    Fibonacci := 0
  else if n = 1 then
    Fibonacci := 1
  else
    Fibonacci := Fibonacci(n - 1) + Fibonacci(n - 2);
end;
```

**Trap:** do not declare a local variable with the same name as the function. It hides the function, and the recursive call stops working.

Combinations, C(n, m) = n! / (m! × (n - m)!), with 0 ≤ m ≤ n:

```pascal
program Combination;
var
  n, m: integer;

function Factorial(k: integer): int64;
var
  i: integer;
  f: int64;
begin
  f := 1;
  for i := 2 to k do
    f := f * i;
  Factorial := f;
end;

begin
  write('Enter n and m: ');
  readln(n, m);
  if m > n then
    writeln('Invalid input')
  else
    writeln(Factorial(n) div (Factorial(m) * Factorial(n - m)));
end.
```

For n = 5 and m = 2 the result is 120 div (2 × 6) = 10. The denominator needs its own parentheses, because `a / b * c` is not `a / (b * c)`.

### 6.7 Dynamic programming and memoization

Plain recursive Fibonacci recomputes the same values again and again, so it becomes very slow beyond about n = 30. **Memoization** stores each result in a table the first time it is computed, and reuses it afterwards. Each value is then calculated once.

```pascal
program DynamicFibonacci;
const
  MAX = 90;
var
  memo: array[0..MAX] of int64;
  n: integer;

function Fib(k: integer): int64;
begin
  if k <= 1 then
    Fib := k
  else
  begin
    if memo[k] = -1 then
      memo[k] := Fib(k - 1) + Fib(k - 2);
    Fib := memo[k];
  end;
end;

begin
  for n := 0 to MAX do
    memo[n] := -1;              { -1 means: not calculated yet }
  write('Enter a number: ');
  readln(n);
  writeln('Fibonacci(', n, ') = ', Fib(n));
end.
```

For n = 40 it shows 102334155 at once. Roles of dynamic programming: it **avoids recalculation** and **reduces running time**.

### 6.8 Common mistakes with subprograms

- The function name never receives a value, so the result is unknown.
- The number or the types of the arguments do not match the parameters.
- A `var` parameter is missing, so the caller never sees the change.
- A `var` parameter is given a constant or an expression instead of a variable.
- A recursive function has no base case, so it calls itself until the program crashes.
- A subprogram is written after the main `begin`, so the compiler does not know it yet.

## 7. Control structures at a glance

| Structure | Pseudocode | Pascal |
|---|---|---|
| Sequence | Action1, Action2 | `statement1; statement2;` |
| If … then | If cond Then actions EndIf | `if cond then statement;` |
| If … then … else | If cond Then A1 Else A2 EndIf | `if cond then s1 else s2;` |
| Multiple choice | Case x Of v1: A1 … Other: A EndCase | `case x of v1: s1; … else s end;` |
| Repeat | Repeat actions Until cond | `repeat statements until cond;` |
| While | While cond Do actions EndDo | `while cond do statement;` |
| For | For i From a To b Do actions EndDo | `for i := a to b do statement;` |

**if.** There is no semicolon before `else`. Several statements need `begin … end`.

```pascal
if number mod 2 = 0 then
  writeln('The number is even.')
else
  writeln('The number is odd.');
```

**case.** It compares one value with constants. Values can be single (`1:`), grouped (`1, 2:`) or ranges (`'A'..'Z':`). The `else` part is the default, and `case` ends with `end;`.

```pascal
case c of
  'A'..'Z': writeln('Uppercase letter');
  'a'..'z': writeln('Lowercase letter');
  '0'..'9': writeln('Digit');
else
  writeln('Neither letter nor digit');
end;
```

**repeat and while compared**

| | repeat … until | while … do |
|---|---|---|
| Condition tested | after the actions | before the actions |
| Runs at least once | yes | no, it may never run |
| Keeps looping while the condition is | False | True |
| Several statements | no `begin … end` needed | `begin … end` needed |

```pascal
repeat
  write('Enter your PIN: ');
  readln(pin);
  tries := tries + 1;
until pin = codePin;
```

```pascal
i := 1;
while i <= 10 do
begin
  writeln('Iteration ', i);
  i := i + 1;       { without this line the loop never ends }
end;
```

**for.** The counter goes up by 1 automatically. The first and the last value are both included. Use `downto` to count down. The counter must be an ordinal type (integer or char), never a real.

```pascal
for i := 1 to 12 do
begin
  writeln('Table of ', i);
  for j := 1 to 10 do
    writeln(i, ' x ', j, ' = ', i * j);
end;
```

**Traps:** never change the counter yourself inside a `for` loop, and never call `inc(i)` there. The `for` already does it, and Pascal does not allow the assignment.

**Accumulators and counters.** An accumulator adds a value each time round the loop. A counter adds a fixed step, 1 by default. Both must start at 0.

```pascal
totalPay := 0;                    { accumulator starts at 0 }
count := 0;                       { counter starts at 0 }
repeat
  readln(pay);
  totalPay := totalPay + pay;     { accumulator: adds the value }
  count := count + 1;             { counter: adds a step of 1 }
until count = 3;
```

With payments of 100,000, 50,000 and 75,000, the total becomes 100,000, then 150,000, then 225,000.

## 8. Arrays

An array reserves cells in memory for values of the **same type**. Each cell is found by its **index**. The index has a name, a first value, a last value (which sets the size) and a type, and it can be a constant or an integer variable.

### 8.1 Declaration

| Pseudocode | Pascal |
|---|---|
| Declare Averages[1..10]: ARRAY OF Real | `var averages: array[1..10] of real;` |
| TYPE TabAvg [1..10] OF Real, then VAR Averages: TabAvg | `type TabAvg = array[1..10] of real;` then `var averages: TabAvg;` |
| a table with 3 rows and 4 columns | `var m: array[1..3, 1..4] of real;` |

Access a cell with `averages[4]`. An index outside the range is an error. Do not call a variable `array`, because it is a reserved word.

### 8.2 Filling and displaying

```pascal
program FillArray;
var
  averages: array[1..10] of real;
  i: integer;
begin
  for i := 1 to 10 do
  begin
    write('Enter the average of student ', i, ': ');
    readln(averages[i]);
  end;
  for i := 1 to 10 do
    writeln('Student ', i, ': ', averages[i]:0:2);
end.
```

### 8.3 Sum, product, average, minimum and maximum

Start a sum at 0, a product at 1, and the minimum and maximum at the first element.

```pascal
program ArrayOperations;
const
  N = 5;
var
  t: array[1..N] of integer;
  i, sum, minV, maxV: integer;
  product: longint;
  average: real;
begin
  t[1] := 15; t[2] := 7; t[3] := 22; t[4] := 3; t[5] := 19;
  sum := 0;
  product := 1;
  minV := t[1];
  maxV := t[1];
  for i := 1 to N do
  begin
    sum := sum + t[i];
    product := product * t[i];
    if t[i] < minV then minV := t[i];
    if t[i] > maxV then maxV := t[i];
  end;
  average := sum / N;
  writeln('Sum = ', sum);                      { 66 }
  writeln('Product = ', product);              { 131670 }
  writeln('Average = ', average:0:2);          { 13.20 }
  writeln('Min = ', minV, '  Max = ', maxV);   { 3 and 22 }
end.
```

**Traps:** the average of whole numbers is a real number, so use `/` and a real variable, not `div`. A product grows fast, so use a Longint.

### 8.4 Sorting

Both sorts below have a running time of O(n²). They are good for learning and for small arrays.

| | Selection sort | Bubble sort |
|---|---|---|
| Idea | find the smallest element of the rest and swap it into place | swap neighbours that are in the wrong order |
| After one pass | the smallest element is first | the largest element is last |
| Swaps | at most n - 1 | many |

Selection sort, ascending:

```pascal
program SelectionSort;
var
  t: array[1..5] of integer;
  i, j, minIdx, temp: integer;
begin
  t[1] := 22; t[2] := 7; t[3] := 15; t[4] := 3; t[5] := 19;
  for i := 1 to 4 do
  begin
    minIdx := i;
    for j := i + 1 to 5 do
      if t[j] < t[minIdx] then
        minIdx := j;
    temp := t[i];
    t[i] := t[minIdx];
    t[minIdx] := temp;
  end;
  for i := 1 to 5 do
    write(t[i], ' ');        { 3 7 15 19 22 }
end.
```

Bubble sort, the core of the program:

```pascal
for i := 1 to 4 do
  for j := 1 to 5 - i do
    if t[j] > t[j + 1] then
    begin
      temp := t[j];
      t[j] := t[j + 1];
      t[j + 1] := temp;
    end;
```

**Trap:** a swap needs three assignments and a temporary variable.

### 8.5 Deleting an element

Shift every element after the deleted one a place to the left, then reduce the size by 1. Here `n` is a variable holding the current size.

```pascal
write('Position to delete (1 to ', n, '): ');
readln(p);
if (p >= 1) and (p <= n) then
begin
  for i := p to n - 1 do
    t[i] := t[i + 1];
  n := n - 1;
end;
```

With 10, 20, 30, 40, 50 and p = 2, the array becomes 10, 30, 40, 50. Use `p` and not `pos`, which is the name of a built-in function.

### 8.6 Searching

**Linear search** looks at the cells one after another. It works on any array and takes O(n).

```pascal
found := false;
i := 1;
while (i <= n) and (not found) do
  if t[i] = x then
    found := true
  else
    i := i + 1;
```

**Binary search** repeatedly halves the search area. It takes O(log n) but **the array must be sorted**.

```pascal
lo := 1;
hi := n;
p := 0;
while (lo <= hi) and (p = 0) do
begin
  mid := (lo + hi) div 2;
  if t[mid] = x then
    p := mid
  else if t[mid] < x then
    lo := mid + 1
  else
    hi := mid - 1;
end;
```

After the loop, `p` is the position of x, or 0 if x is absent.

### 8.7 Two-dimensional arrays

A two-dimensional array is a table. The first index is the row and the second is the column. Use two nested `for` loops.

```pascal
program Transcript;
var
  marks: array[1..3, 1..4] of real;
  student: array[1..3] of string;
  i, j: integer;
  total: real;
begin
  student[1] := 'July';
  student[2] := 'Roland';
  student[3] := 'Andre';
  for i := 1 to 3 do
  begin
    writeln('Marks of ', student[i], ':');
    for j := 1 to 4 do
    begin
      write('  Subject ', j, ': ');
      readln(marks[i, j]);
    end;
  end;
  for i := 1 to 3 do
  begin
    total := 0;                         { restart for each student }
    for j := 1 to 4 do
      total := total + marks[i, j];
    writeln('Average of ', student[i], ': ', total / 4:0:2);
  end;
end.
```

With the marks 4, 5, 7 and 3 for July, the average is 4.75.

**Trap:** forget to reset `total := 0` for each student and the totals pile up from one row to the next.

## 9. Records

An array holds values of one type. A **record** groups values of **different** types that describe one entity, such as a student with a name, an age and an average. Each part of a record is a **field**.

Without records you would need one array per field (`names`, `ages`, `averages`) and keep them in step. With a record you keep one array of students.

| Pseudocode | Pascal |
|---|---|
| TYPE Student = RECORD … END RECORD | `type Student = record … end;` |
| Name: String | `name: string[50];` |
| Age: Integer | `age: integer;` |
| Average: Real | `average: real;` |
| Declare s As Student | `var s: Student;` |
| Declare students[1..4]: ARRAY OF Student | `var students: array[1..4] of Student;` |

A field is reached with the **dot operator**: `s.name`, `s.age`, `students[2].average`. An array cell is reached with an index, and a record field with a name.

```pascal
program StudentRecords;
uses crt;
type
  Student = record
    name: string[50];
    age: integer;
    average: real;
  end;
var
  students: array[1..4] of Student;
  i: integer;
begin
  ClrScr;
  for i := 1 to 4 do
  begin
    write('Enter the name of student ', i, ': ');
    readln(students[i].name);
    write('Enter the age of student ', i, ': ');
    readln(students[i].age);
    write('Enter the average of student ', i, ': ');
    readln(students[i].average);
  end;
  writeln('STUDENT INFORMATION');
  for i := 1 to 4 do
  begin
    writeln('Student ', i, ':');
    writeln('  Name: ', students[i].name);
    writeln('  Age: ', students[i].age);
    writeln('  Average: ', students[i].average:0:2);
  end;
  ReadKey;
end.
```

**Traps**

- `readln(s)` and `writeln(s)` do not work on a whole record. Read and write the fields one by one.
- Two records of the same type can be copied with `s2 := s1;`.
- The type goes in the `type` section and the variable in the `var` section. Declaring the type alone creates no variable.

## 10. Files

Variables, arrays and records live in RAM, which is erased when the program ends. Data about a student, a product or an order must outlive the program, so it is saved in a **file** on a disk or a USB key.

- A **record** is the set of values that completely describes one entity.
- A **file** is a set of records of the same kind, stored with a name on a physical medium.

### 10.1 Declaring a file

| Kind | Pascal | Use |
|---|---|---|
| Text file | `var f: text;` | lines of text |
| Typed file | `type PersonFile = file of Person;` then `var f: PersonFile;` | records of one type |

| | Text file | Typed file |
|---|---|---|
| Content | lines of characters | records, stored in binary form |
| Write and read with | `write`, `writeln`, `read`, `readln` | `write`, `read` only |
| Readable in a text editor | yes | no |
| Jump to a record | no | yes, with `seek` |

Strings inside the record of a typed file must have a fixed size, such as `string[30]`.

### 10.2 The five steps

1. **Link** the file variable to a file name: `assign(f, 'myfile.txt');`
2. **Open** it: `rewrite(f);` to write (this creates it, or erases it if it exists), or `reset(f);` to read.
3. **Write or read** the data.
4. Use `eof(f)` to know when the end of the file is reached.
5. **Close** it: `close(f);`

### 10.3 A text file

The objective is to write a line to a file, then read it back and display it.

```pascal
program TextFileDemo;
var
  f: text;
  line: string;
begin
  assign(f, 'myfile.txt');
  rewrite(f);                      { open for writing }
  writeln(f, 'Hello, I am a line in a file!');
  close(f);

  reset(f);                        { open for reading }
  while not eof(f) do
  begin
    readln(f, line);
    writeln('File content: ', line);
  end;
  close(f);
end.
```

The file `myfile.txt` is created in the folder of the program and holds the line `Hello, I am a line in a file!`. The program then shows that line on the screen.

### 10.4 A typed file: staff management

```pascal
program StaffFile;
uses crt;
type
  Person = record
    name: string[30];
    age: integer;
  end;
  PersonFile = file of Person;
var
  f: PersonFile;
  p: Person;
  answer: char;
begin
  ClrScr;
  assign(f, 'persons.dat');
  rewrite(f);                          { create the file }
  repeat
    write('Name of the person: ');
    readln(p.name);
    write('Age: ');
    readln(p.age);
    write(f, p);                       { store the record in the file }
    write('Add another person? (y/n) ');
    readln(answer);
  until (answer <> 'y') and (answer <> 'Y');
  close(f);

  reset(f);                            { read everything back }
  writeln('Content of the file:');
  while not eof(f) do
  begin
    read(f, p);
    writeln('Name: ', p.name, '   Age: ', p.age);
  end;
  close(f);
  ReadKey;
end.
```

### 10.5 Sequential and relative access

In **sequential** access, records are read one after the other, from the first. In **relative** access, you jump straight to a record by its position.

| Routine | What it does |
|---|---|
| `seek(f, n)` | moves to record number n; the first record is number 0 |
| `filepos(f)` | the number of the current record |
| `filesize(f)` | the number of records in the file |

```pascal
seek(f, 2);        { go to the third record }
read(f, p);
```

**Traps**

- `reset` on a file that does not exist stops the program. `rewrite` on a file that exists erases it.
- A file that is not closed may lose data. Always call `close`.
- Test `eof` before each `read`, or you read past the end.
- A typed file takes `read` and `write`. It does not take `readln` and `writeln`.
- To add lines to an existing text file, open it with `append(f)`, not `rewrite(f)`.

## 11. Algorithm basics

### 11.1 What an algorithm is

An algorithm is a finite sequence of unambiguous steps that solves a problem, produces a result and ends after a finite number of steps. It has four characteristics:

- **Input:** it may or may not need data.
- **Output:** it produces at least one result.
- **Definiteness:** every instruction is clear and unambiguous.
- **Finiteness:** it ends after a finite number of steps.

An algorithm describes the solution in natural language or pseudocode. A **program** is the translation of that algorithm into a programming language.

### 11.2 How to write an algorithm

1. **Define the input:** for a rectangle, its height and width.
2. **Define the variables,** with meaningful names: `HEIGHT`, `WIDTH`, `AREA`.
3. **Outline the operations:** `AREA ← HEIGHT * WIDTH`.
4. **Output the result:** for a height of 2 and a width of 3, the output is 6.

Example, the area and perimeter of a square with side L:

```text
Step 1  Start
Step 2  Input L
Step 3  AREA ← L * L
Step 4  PERIMETER ← 4 * L
Step 5  Display AREA, PERIMETER
Step 6  Stop
```

### 11.3 The program design process

Problem statement → analysis → algorithm → coding → source program → compiling → executable program → running → result.

The analysis and the coding are human work. The compiling and the running are done by the machine.

| | Syntax error | Semantic error |
|---|---|---|
| Cause | a spelling or grammar mistake in the code | a poor method, a logic fault |
| Found | by the compiler, when it cannot translate an instruction | when the program runs and gives a wrong result |
| Result | no executable program | the program runs but does not meet the user's need |
| Go back to | the coding | the analysis |

### 11.4 Flowchart symbols

| Symbol | Name | Use |
|---|---|---|
| Oval | terminator | start and end |
| Parallelogram | input / output | read or display data |
| Rectangle | process | calculations and data handling |
| Diamond | decision | a condition with two or more ways out |
| Arrow | flow line | direction of the logic |
| Circle | connector | link between two parts of a flowchart |
| Rectangle with side bars | predefined process | a subprogram |

### 11.5 Kinds of algorithm

| Kind | How it works | Typical use |
|---|---|---|
| Linear | steps one after another | adding two numbers |
| Conditional | branches with if or case | validating an input |
| Iterative | repeats with a loop | summing array elements |
| Recursive | calls itself on a smaller problem | factorial, Fibonacci |
| Sorting | puts data in order | lists and databases |
| Searching | finds an element | looking up a record |
| Greedy | takes the best choice at each step | scheduling, shortest path |
| Divide and conquer | splits, solves, then combines | merge sort, quick sort |

- **Top-down design** breaks a complex problem into simpler sub-problems. **Bottom-up design** solves the simplest parts first and combines them.
- **Complexity** compares running time, for example O(n) for a loop and O(n²) for the two sorts above.

### 11.6 Compiler, interpreter and IDE

- A **compiler** translates the whole source program into machine language before it runs. Pascal, C and C++ are compiled.
- An **interpreter** executes a program without translating it all first. Python, PHP, Visual Basic and LISP are interpreted.
- An **IDE** (integrated development environment), such as Free Pascal or CodeBlocks, is software for writing, compiling and testing programs.

## 12. Common mistakes

| Mistake | Fix |
|---|---|
| `x = 5` to store a value | `x := 5;` |
| `;` just before `else` | remove it |
| program ends with `end;` | the last line is `end.` |
| `result := a / b` into an integer | use `div`, or a real variable |
| `if x > 0 and y > 0` | `if (x > 0) and (y > 0)` |
| changing the counter inside `for` | use `while`, or leave the counter alone |
| sum or product not initialised | `sum := 0;` and `product := 1;` |
| `'student's name'` | `'student''s name'` |
| a variable named `array`, `begin` or `end` | choose another name |
| `ClrScr` or `ReadKey` without a unit | add `uses crt;` |
| two `uses` lines | one line: `uses crt, SysUtils;` |
| `sqrt` result stored in an integer | `trunc(sqrt(x))` |
| `power`, `ceil`, `floor`, `max`, `min` not found | add `uses math;` |
| integer overflow in a factorial | use `longint` or `int64` |
| a `var` parameter missing | the caller never sees the change |
| the function name never assigned | assign the result to the function name |
| a recursive function with no base case | add the stopping case first |
| binary search on an unsorted array | sort the array first |
| average of whole numbers using `div` | use `/` and a real result |
| file not closed | call `close(f);` |
| `readln` or `writeln` on a typed file | use `read` and `write` |
| `reset` on a file that does not exist | create it first with `rewrite` |

## 13. Notes on the course listings

Some listings in the course notes contain typing slips. This book shows the corrected form, so you can check them against your copy:

- `Var A : Interger` is written `Integer`.
- The constant π is given as 3.141559. The digits are 3.14159…
- The combination listing does not divide by the right factorials. The correct formula is in section 6.6.
- The Fibonacci listings declare a local variable with the name of the function, and use curly quotes and long dashes, which Pascal rejects.
- The memoized Fibonacci uses `integer`, which is too small for large values, and tests the memo table before the base case.
- The maximum-of-two-numbers algorithm displays `'x is negative'` by mistake.
- Some programs name a variable `array`, a reserved word, or use two `uses` lines.
- The multiplication-table listing changes the loop counter inside a `for` loop.
- The PIN listing reads `codepin`, which is never declared.
- `'Enter the student's name'` needs a doubled quote.
- The array average is calculated with `div` into an integer, so the decimals are lost.
- The sorting pseudocode counts from 0 while the arrays are declared from 1.
- The operators table lists `%`, `//` and `**`, which belong to other languages. Pascal uses `mod`, `div` and `sqr` or `power`.
- The Fibonacci exercise defines F(n) = 1 `if n < 0 and n < 2`, which cannot be true. Use the definition in section 6.6.
