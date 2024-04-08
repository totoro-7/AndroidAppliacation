package com.example.androidappliacation;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
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

    FirebaseAuth auth = FirebaseAuth.getInstance();
    FirebaseUser user = auth.getCurrentUser();
    DatabaseReference databaseReferenceSecond = database.getReference();

    String quizQuestion;
    String quizAnswerA;
    String quizAnswerB;
    String quizAnswerC;
    String quizAnswerD;
    String quizCorrectAnswer;
    int questionCount;
    int questionNumber = 0;

    String userAnswer;

    int userCorrect = 0;
    int userWrong = 0;

    CountDownTimer countDownTimer;
    private static final long TOTAL_TIME = 25000;
    Boolean timerContinue;
    long leftTime = TOTAL_TIME;

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

                resetTimer();
                game();
                sendScore();

            }
        });

        a.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String userUID = user.getUid();

                pauseTimer();

                userAnswer = "0";
                databaseReferenceSecond.child("values").child(quizQuestion).child(userUID).setValue(userAnswer);

                if(quizCorrectAnswer.equals(userAnswer))
                {
                    a.setBackgroundResource(R.color.green);
                    userCorrect++;
                    correct.setText("" + userCorrect);

                }
                else
                {
                    a.setBackgroundResource(R.color.red);
                    userWrong++;
                    wrong.setText("" + userWrong);
                    findAnswer();
                }
            }
        });

        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String userUID = user.getUid();

                pauseTimer();

                userAnswer = "1";
                databaseReferenceSecond.child("values").child(quizQuestion).child(userUID).setValue(userAnswer);

                if(quizCorrectAnswer.equals(userAnswer))
                {
                    b.setBackgroundResource(R.color.green);
                    userCorrect++;
                    correct.setText("" + userCorrect);
                }
                else
                {
                    b.setBackgroundResource(R.color.red);
                    userWrong++;
                    wrong.setText("" + userWrong);
                    findAnswer();
                }
            }
        });

        c.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String userUID = user.getUid();

                pauseTimer();

                userAnswer = "2";
                databaseReferenceSecond.child("values").child(quizQuestion).child(userUID).setValue(userAnswer);

                if(quizCorrectAnswer.equals(userAnswer))
                {
                    c.setBackgroundResource(R.color.green);
                    userCorrect++;
                    correct.setText("" + userCorrect);
                }
                else
                {
                    c.setBackgroundResource(R.color.red);
                    userWrong++;
                    wrong.setText("" + userWrong);
                    findAnswer();
                }
            }
        });

        d.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String userUID = user.getUid();

                pauseTimer();

                userAnswer = "3";
                databaseReferenceSecond.child("values").child(quizQuestion).child(userUID).setValue(userAnswer);

                if(quizCorrectAnswer.equals(userAnswer))
                {
                    d.setBackgroundResource(R.color.green);
                    userCorrect++;
                    correct.setText("" + userCorrect);
                }
                else
                {
                    d.setBackgroundResource(R.color.red);
                    userWrong++;
                    wrong.setText("" + userWrong);
                    findAnswer();
                }
            }
        });

    }

    public void game()
    {
        startTimer();

        a.setBackgroundResource(R.color.navyblue);
        b.setBackgroundResource(R.color.navyblue);
        c.setBackgroundResource(R.color.navyblue);
        d.setBackgroundResource(R.color.navyblue);

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
                next.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        sendScore();
                        Intent i = new Intent(Quiz_Page.this, Score_Page.class);
                        startActivity(i);
                        finish();

                    }
                });
                Toast.makeText(Quiz_Page.this,"You have reached the last question"
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

    public void findAnswer()
    {
        if (quizCorrectAnswer.equals("0"))
        {
            a.setBackgroundResource(R.color.green);
        }
        else if (quizCorrectAnswer.equals("1"))
        {
            b.setBackgroundResource(R.color.green);
        }
        else if (quizCorrectAnswer.equals("2"))
        {
            c.setBackgroundResource(R.color.green);
        }
        else if (quizCorrectAnswer.equals("3"))
        {
            d.setBackgroundResource(R.color.green);
        }
    }

    public void startTimer()
    {
        countDownTimer = new CountDownTimer(leftTime,1000) {
            @Override
            public void onTick(long millisUntilFinished) {

                leftTime = millisUntilFinished;
                updateCountDownText();

            }

            @Override
            public void onFinish() {

                timerContinue = false;
                pauseTimer();
                question.setText("Time is up!");
            }
        }.start();

        timerContinue = true;

    }

    public void resetTimer()
    {
        leftTime = TOTAL_TIME;
        updateCountDownText();
    }

    public void updateCountDownText()
    {
        int second = (int) (leftTime/1000) % 60;
        time.setText("" + second);
    }

    public void pauseTimer()
    {
        countDownTimer.cancel();;
        timerContinue = false;
    }

    public void sendScore()
    {

        String userUID = user.getUid();
        databaseReferenceSecond.child("scores").child(userUID).child("correct").setValue(userCorrect);
        databaseReferenceSecond.child("scores").child(userUID).child("wrong").setValue(userWrong);

    }

}