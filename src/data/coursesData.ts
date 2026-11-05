import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'c-programming',
    title: 'C Programming Mastery',
    language: 'C',
    icon: 'Terminal',
    difficulty: 'Beginner',
    estimatedHours: 18,
    description: 'Master systems programming, manual memory management, pointers, and foundational computer architecture.',
    lessons: [
      {
        id: 'c-intro',
        title: 'Introduction to C & Compilers',
        duration: '20 min',
        description: 'Understand the anatomy of a C program, header files, the compilation lifecycle, and main().',
        content: `C is a procedural programming language developed in 1972 by Dennis Ritchie at Bell Labs. It provides low-level memory access while offering structured high-level constructs.

### The Compilation Process:
1. **Preprocessing**: Resolves directives like \`#include\` and macros.
2. **Compilation**: Converts C code into assembly instructions.
3. **Assembly**: Translates assembly to machine code (object files).
4. **Linking**: Combines object files and libraries into an executable.`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    printf("Hello, CodeBuddy AI!\\n");
    return 0;
}`,
        keyPoints: [
          '#include <stdio.h> imports standard input/output functions',
          'main() is the execution entry point of every C program',
          'return 0 indicates successful execution to the operating system'
        ],
        exercisePrompt: 'Modify the program to print your name and current learning goal on two separate lines.',
        starterCode: `#include <stdio.h>

int main(void) {
    // Write your code here
    return 0;
}`
      },
      {
        id: 'c-variables',
        title: 'Variables and Memory Sizes',
        duration: '25 min',
        description: 'Deep dive into primitive data types: int, float, double, char, and sizeof() operator.',
        content: `In C, variables represent labeled memory blocks. Each data type has a defined byte size and range.`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int age = 22;
    float gpa = 3.85f;
    char grade = 'A';

    printf("Age: %d, GPA: %.2f, Grade: %c\\n", age, gpa, grade);
    printf("Size of int: %lu bytes\\n", sizeof(int));
    return 0;
}`,
        keyPoints: [
          'Primitive types map directly to hardware word sizes',
          'Use %d for integers, %f for floats, and %c for characters',
          'sizeof evaluates the byte allocation size at compile time'
        ]
      },
      {
        id: 'c-pointers',
        title: 'Pointers & Memory Addresses',
        duration: '40 min',
        description: 'Demystify the address-of operator (&), dereference operator (*), and pointer arithmetic.',
        content: `A pointer is a variable that stores the memory address of another variable. Pointers are the heart of C efficiency and dynamic data structures.`,
        codeSnippet: `#include <stdio.h>

int main(void) {
    int num = 42;
    int *ptr = &num; // ptr holds address of num

    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", (void*)&num);
    printf("Value via pointer: %d\\n", *ptr);

    *ptr = 100; // Modifies num directly in memory
    printf("Updated num: %d\\n", num);
    return 0;
}`,
        keyPoints: [
          '& gets the memory address of a variable',
          '* in declaration defines a pointer; * in expression dereferences it',
          'Direct memory manipulation allows high performance and mutable references'
        ]
      },
      {
        id: 'c-structures',
        title: 'Structures and Typedef',
        duration: '35 min',
        description: 'Bundle heterogeneous data fields into custom user-defined types.',
        content: `A struct allows grouping variables of different types under a single unified name.`,
        codeSnippet: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int score;
    float rating;
} Student;

int main(void) {
    Student s1;
    strcpy(s1.name, "Alice");
    s1.score = 98;
    s1.rating = 4.9f;

    printf("Student: %s, Score: %d\\n", s1.name, s1.score);
    return 0;
}`,
        keyPoints: [
          'structs group heterogeneous data fields',
          'typedef creates concise type aliases without repeated struct keywords',
          'Use the dot (.) operator for values and arrow (->) for pointers to structs'
        ]
      }
    ]
  },
  {
    id: 'cpp-programming',
    title: 'C++ Object-Oriented Architecture',
    language: 'C++',
    icon: 'Cpu',
    difficulty: 'Intermediate',
    estimatedHours: 22,
    description: 'Learn modern C++, RAII, object-oriented principles, polymorphism, templates, and the STL.',
    lessons: [
      {
        id: 'cpp-classes',
        title: 'Classes, Objects & Encapsulation',
        duration: '30 min',
        description: 'Define classes with private member variables, public interfaces, and constructors.',
        content: `C++ enhances C with true Object-Oriented features, strong typing, and the Standard Template Library (STL). Encapsulation hides internal representation to prevent direct unauthorized access.`,
        codeSnippet: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner;
    double balance;

public:
    BankAccount(std::string name, double initial) : owner(name), balance(initial) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void display() const {
        std::cout << "Account: " << owner << " | Balance: $" << balance << std::endl;
    }
};

int main() {
    BankAccount acc("Devon", 1500.0);
    acc.deposit(350.0);
    acc.display();
    return 0;
}`,
        keyPoints: [
          'Classes encapsulate state (attributes) and behavior (methods)',
          'Access specifiers: public, private, and protected',
          'Constructor initialization lists provide efficient direct construction'
        ]
      },
      {
        id: 'cpp-inheritance',
        title: 'Inheritance and Virtual Polymorphism',
        duration: '35 min',
        description: 'Implement polymorphic hierarchies using virtual functions and abstract base classes.',
        content: `Polymorphism allows derived classes to override base behavior dynamically at runtime using virtual tables (vtables).`,
        codeSnippet: `#include <iostream>
#include <vector>
#include <memory>

class Shape {
public:
    virtual double area() const = 0; // Pure virtual function
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double width, double height) : w(width), h(height) {}
    double area() const override { return w * h; }
};

int main() {
    std::unique_ptr<Shape> s = std::make_unique<Rectangle>(5.0, 4.0);
    std::cout << "Area: " << s->area() << std::endl;
    return 0;
}`,
        keyPoints: [
          'Pure virtual functions (= 0) create abstract interfaces',
          'Virtual destructors guarantee proper cleanup of derived objects',
          'Use modern smart pointers (std::unique_ptr) for automated memory safety'
        ]
      }
    ]
  },
  {
    id: 'python-mastery',
    title: 'Python for Developers & AI',
    language: 'Python',
    icon: 'Layers',
    difficulty: 'Beginner',
    estimatedHours: 16,
    description: 'Learn clean, idiomatic Python: list comprehensions, generators, dictionaries, OOP, and data pipelines.',
    lessons: [
      {
        id: 'py-data-structures',
        title: 'Lists, Tuples, Dictionaries & Sets',
        duration: '25 min',
        description: 'Explore the computational complexity and idiomatic usage of native Python collections.',
        content: `Python provides expressive data structures with O(1) hash-map lookups for dicts and sets.`,
        codeSnippet: `# List Comprehensions and Dict Transformations
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [x**2 for x in numbers if x % 2 == 0]

student_grades = {"Alice": 92, "Bob": 85, "Charlie": 95}
honor_roll = {k: v for k, v in student_grades.items() if v >= 90}

print("Squares:", evens_squared)
print("Honor Roll:", honor_roll)`,
        keyPoints: [
          'List comprehensions are concise, readable, and faster than manual append loops',
          'Dictionaries offer average O(1) key-based retrieval',
          'Tuples are immutable; lists are mutable sequences'
        ]
      },
      {
        id: 'py-functions-generators',
        title: 'Functions, *args, **kwargs & Generators',
        duration: '30 min',
        description: 'Master first-class functions, closures, decorators, and memory-efficient generators.',
        content: `Generators yield values on demand, saving memory when processing massive data streams.`,
        codeSnippet: `def fibonacci_stream(limit):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b

# Lazily consume stream
for num in fibonacci_stream(8):
    print(num, end=" ")
print()`,
        keyPoints: [
          'yield creates a generator function that produces values lazily',
          'Generators preserve state between iterations without loading all data into RAM'
        ]
      }
    ]
  },
  {
    id: 'javascript-fundamentals',
    title: 'Modern JavaScript & Async Engine',
    language: 'JavaScript',
    icon: 'Code2',
    difficulty: 'Beginner',
    estimatedHours: 15,
    description: 'Master the event loop, ES6+, Promises, async/await, closures, and DOM engineering.',
    lessons: [
      {
        id: 'js-async',
        title: 'Promises, Async/Await & Event Loop',
        duration: '35 min',
        description: 'Understand the microtask queue, call stack, non-blocking I/O, and robust error handling.',
        content: `JavaScript is single-threaded with an event loop handling asynchronous callbacks through the task and microtask queues.`,
        codeSnippet: `// Async/Await with simulated fetch
async function loadUserData(userId) {
  try {
    console.log("Fetching user...", userId);
    // Simulating API latency
    const user = await new Promise((resolve) => 
      setTimeout(() => resolve({ id: userId, name: "Ada Lovelace", role: "Pioneer" }), 100)
    );
    console.log("Received:", user.name);
    return user;
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

loadUserData(42).then(user => console.log("Done!", user.role));`,
        keyPoints: [
          'async functions always return a Promise',
          'await pauses execution within the function until the Promise settles',
          'Microtasks (Promises) execute before standard Macrotasks (setTimeout)'
        ]
      },
      {
        id: 'js-arrays-hof',
        title: 'Functional Array Methods (map, filter, reduce)',
        duration: '25 min',
        description: 'Write declarative, bug-free pipelines without mutating source data.',
        content: `Higher-order functions accept functions as parameters, enabling functional programming patterns.`,
        codeSnippet: `const transactions = [
  { id: 1, type: 'credit', amount: 250 },
  { id: 2, type: 'debit', amount: 50 },
  { id: 3, type: 'credit', amount: 120 }
];

const totalCredit = transactions
  .filter(t => t.type === 'credit')
  .map(t => t.amount)
  .reduce((acc, curr) => acc + curr, 0);

console.log("Total Credit Balance:", totalCredit);`,
        keyPoints: [
          'map transforms each item into a new value',
          'filter removes elements that fail the predicate test',
          'reduce folds an array down into a single accumulated result'
        ]
      }
    ]
  },
  {
    id: 'java-core',
    title: 'Java Core & Enterprise Foundations',
    language: 'Java',
    icon: 'Coffee',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    description: 'Learn JVM architecture, strict type safety, multithreading, Streams API, and design patterns.',
    lessons: [
      {
        id: 'java-basics',
        title: 'Java Class Anatomy & JVM',
        duration: '30 min',
        description: 'Write compile-time type-safe object structures running on the Java Virtual Machine.',
        content: `Java compiles into bytecode (.class) which the JVM executes anywhere. Memory is managed via automated Garbage Collection.`,
        codeSnippet: `public class Main {
    public static void main(String[] args) {
        String greeting = "Welcome to Java on CodeBuddy!";
        System.out.println(greeting);

        int[] scores = {98, 85, 92, 100};
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        System.out.println("Average: " + (double) sum / scores.length);
    }
}`,
        keyPoints: [
          'Java requires all code to reside inside class definitions',
          'Bytecode ensures write-once, run-anywhere cross-platform execution',
          'JVM garbage collection automatically reclaims unused heap memory'
        ]
      }
    ]
  },
  {
    id: 'html-css-modern',
    title: 'Modern HTML5 & Responsive CSS3',
    language: 'HTML & CSS',
    icon: 'Layout',
    difficulty: 'Beginner',
    estimatedHours: 12,
    description: 'Build accessible, semantic markup with CSS Flexbox, Grid, custom properties, and responsive layouts.',
    lessons: [
      {
        id: 'html-flex-grid',
        title: 'Modern Flexbox & Grid Systems',
        duration: '25 min',
        description: 'Master 1-dimensional and 2-dimensional CSS layout engines.',
        content: `Flexbox is designed for 1-dimensional alignment (rows or columns), while CSS Grid handles complex 2-dimensional layouts with ease.`,
        codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
    background: #0f1422;
    color: #f1f5f9;
  }
  .card {
    background: #1e293b;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #334155;
  }
</style>
</head>
<body>
  <div class="dashboard-grid">
    <div class="card">Stats A</div>
    <div class="card">Stats B</div>
    <div class="card">Stats C</div>
  </div>
</body>
</html>`,
        keyPoints: [
          'grid-template-columns with auto-fit and minmax creates responsive cards without media queries',
          'Flexbox excels at linear alignments (navbars, toolbars)',
          'Semantic tags (article, section, nav) provide accessibility for screen readers'
        ]
      }
    ]
  },
  {
    id: 'sql-databases',
    title: 'SQL Relational Database Engineering',
    language: 'SQL',
    icon: 'Database',
    difficulty: 'Beginner',
    estimatedHours: 14,
    description: 'Write performant relational queries, JOINs, group-bys, subqueries, and indexing strategies.',
    lessons: [
      {
        id: 'sql-joins-aggregates',
        title: 'JOINs, Aggregations & Group By',
        duration: '30 min',
        description: 'Combine tables using INNER, LEFT, and RIGHT JOINs, and analyze metrics with GROUP BY.',
        content: `Relational databases use foreign keys to normalize data and avoid redundancy. JOIN operations link relations together on common attributes.`,
        codeSnippet: `-- Calculate total revenue per course
SELECT 
    c.title AS course_title,
    COUNT(s.student_id) AS enrolled_students,
    SUM(s.payment_amount) AS total_revenue
FROM courses c
LEFT JOIN enrollments s ON c.course_id = s.course_id
WHERE c.is_active = TRUE
GROUP BY c.course_id, c.title
HAVING COUNT(s.student_id) > 5
ORDER BY total_revenue DESC;`,
        keyPoints: [
          'LEFT JOIN preserves all rows from the primary table even with no matching foreign row',
          'GROUP BY collapses rows into aggregate totals',
          'HAVING filters groups post-aggregation, while WHERE filters rows pre-aggregation'
        ]
      }
    ]
  }
];
