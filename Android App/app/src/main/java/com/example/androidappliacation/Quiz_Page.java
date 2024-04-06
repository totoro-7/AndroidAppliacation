package com.example.androidappliacation;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.w3c.dom.Text;

public class Quiz_Page extends AppCompatActivity {

    TextView time, correct, wrong;
    TextView question, a , b, c, d;
    Button next;

    FirebaseDatabase database = FirebaseDatabase.getInstance();
    DatabaseReference databaseReference = database.getReference().child("quizzes");

    String quizQuestion;
    String quizAnswerA;
    String quizAnswerB;
    String quizAnswerC;
    String quizAnswerD;
    String quizCorrectAnswer;
    int questionCount;
    int questionNumber = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz_page);

        time = findViewById(R.id.textViewTime);
        correct = findViewById(R.id.textViewCorrect);
        wrong = findViewById(R.id.textViewWrong);

        question = findViewById(R.id.textViewQuestion);
        a = findViewById(R.id.textViewA);
        b = findViewById(R.id.textViewB);
        c = findViewById(R.id.textViewC);
        d = findViewById(R.id.textViewD);

        next = findViewById(R.id.buttonNext);

        game();

        next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                game();

            }
        });

    }

    public void game()
    {
        // Read from the database
        databaseReference.addValueEventListener(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
            // This method is called once with the initial value and again
            // whenever data at this location is updated.

            questionCount = (int) dataSnapshot.child("quiz1").child("questions").getChildrenCount() - 1;

            quizQuestion = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("questionText").getValue().toString();
            quizAnswerA = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("options").child("0").getValue().toString();
            quizAnswerB = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("options").child("1").getValue().toString();
            quizAnswerC = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("options").child("2").getValue().toString();
            quizAnswerD = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("options").child("3").getValue().toString();
            quizCorrectAnswer = dataSnapshot.child("quiz1").child("questions").child(String.valueOf(questionNumber))
                    .child("correctAnswerIndex").getValue().toString();

            question.setText(quizQuestion);
            a.setText(quizAnswerA);
            b.setText(quizAnswerB);
            c.setText(quizAnswerC);
            d.setText(quizAnswerD);

            if (questionNumber < questionCount)
            {
                questionNumber++;
            }
            else
            {
                Toast.makeText(Quiz_Page.this,"You answered all questions"
                        ,Toast.LENGTH_SHORT).show();
            }

        }

        @Override
        public void onCancelled(DatabaseError error) {
            Toast.makeText(Quiz_Page.this,"There is an error"
                    ,Toast.LENGTH_SHORT).show();
        }

    });
    }
}