from flask import Flask, render_template, flash, request, redirect, url_for
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date
from webforms import LoginForm, PostForm, UserForm, PasswordForm, NamerForm, SearchForm, ResetForm, ChangeForm
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from webforms import LoginForm, PostForm, UserForm, PasswordForm, NamerForm
from flask_ckeditor import CKEditor
from flask_mail import Mail, Message
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from werkzeug.utils import secure_filename
import uuid as uuid
from flask_bcrypt import Bcrypt
import os


app = Flask(__name__)

ckeditor = CKEditor(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = "supersecretcoolthing"

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'mailforaproject@gmail.com'
app.config['MAIL_PASSWORD'] = 'Temp123??'

mail = Mail(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


@app.context_processor
def base():
    form = SearchForm()
    return dict(form=form)


@app.route('/admin')
@login_required
def admin():
    id = current_user.id
    if id == 1:
        return render_template("admin.html")
    else:
        flash("Sorry you must be the Admin to access the Admin Page...")
        return redirect(url_for('dashboard'))


@app.route('/search', methods=["POST"])
def search():
    form = SearchForm()
    posts = Posts.query
    if form.validate_on_submit():
        # Get data from submitted form
        post.searched = form.searched.data
        # Query the Database
        posts = posts.filter(Posts.content.like('%' + post.searched + '%'))
        posts = posts.order_by(Posts.title).all()

        return render_template("search.html",
                               form=form,
                               searched=post.searched,
                               posts=posts)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password_hash, form.password.data):
                login_user(user)
                flash("Login Succesfull!!")
                return redirect(url_for('dashboard'))
            else:
                flash("Wrong Password - Try Again or Reset Password!")
        else:
            flash("That User Doesn't Exist! Try Again...")

    return render_template('login.html', form=form)


def sendreset(user):
    token = user.get_token()
    message = Message('Password Reset Requested',
                      recipient=user.email, sender='noreply@gmail.com')
    message.body = f''' Reset your password. Click on the link.

    {url_for(resettoken,token=token,_external=True)}
    
    '''


@app.route('/reset', methods=['GET', 'POST'])
def reset():
    form = ResetForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(email=form.email.data).first()
        if user:
            sendreset(user)
            flash('Reset request sent to email.')
            return redirect(url_for('login'))
        else:
            flash("That Email Is Not Registered...")
    return render_template('reset.html', title="Forgot Password", form=form)


@app.route('/reset/<token>', methods=['GET', 'POST'])
def resettoken(token):
    user = User.verify_token(token)
    if user is None:
        flash('That is not going to work. Give up')
        return redirect(url_for('reset'))
    form = ChangeForm()
    if form.validate_on_submit():
        hashedpassword = bcrypt.generate_password_hash(
            form.password.data).decode('utf-8')
        user.password = hashedpassword
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('changer.html', form=form)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    flash("You Have Been Logged Out!  Thanks For Stopping By...")
    return redirect(url_for('login'))


@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    form = UserForm()
    id = current_user.id
    name_to_update = Users.query.get_or_404(id)
    if request.method == "POST":
        name_to_update.name = request.form['name']
        name_to_update.email = request.form['email']
        name_to_update.favorite_movie = request.form['favorite_movie']
        name_to_update.username = request.form['username']
        name_to_update.about_author = request.form['about_author']

        if request.files['profile_pic']:
            name_to_update.profile_pic = request.files['profile_pic']

            pic_filename = secure_filename(name_to_update.profile_pic.filename)

            pic_name = str(uuid.uuid1()) + "_" + pic_filename

            saver = request.files['profile_pic']

            name_to_update.profile_pic = pic_name
            try:
                db.session.commit()
                saver.save(os.path.join(app.config['UPLOAD_FOLDER'], pic_name))
                flash("User Updated Successfully!")
                return render_template("dashboard.html",
                                       form=form,
                                       name_to_update=name_to_update)
            except:
                flash("Error!  Looks like there was a problem...try again!")
                return render_template("dashboard.html",
                                       form=form,
                                       name_to_update=name_to_update)
        else:
            db.session.commit()
            flash("User Updated Successfully!")
            return render_template("dashboard.html",
                                   form=form,
                                   name_to_update=name_to_update)
    else:
        return render_template("dashboard.html",
                               form=form,
                               name_to_update=name_to_update,
                               id=id)

    return render_template('dashboard.html')


@app.route('/posts/delete/<int:id>')
@login_required
def delete_post(id):
    post_to_delete = Posts.query.get_or_404(id)
    id = current_user.id
    if id == post_to_delete.poster.id or id == 14:
        try:
            db.session.delete(post_to_delete)
            db.session.commit()

            # Return a message
            flash("Blog Post Was Deleted!")

            # Grab all the posts from the database
            posts = Posts.query.order_by(Posts.date_posted)
            return render_template("posts.html", posts=posts)

        except:

            flash("Whoops! There was a problem deleting post, try again...")

            # Grab all the posts from the database
            posts = Posts.query.order_by(Posts.date_posted)
            return render_template("posts.html", posts=posts)
    else:
        # Return a message
        flash("You Aren't Authorized To Delete That Post!")

        # Grab all the posts from the database
        posts = Posts.query.order_by(Posts.date_posted)
        return render_template("posts.html", posts=posts)


@app.route('/posts')
def posts():
    # Grab all the posts from the database
    posts = Posts.query.order_by(Posts.date_posted)
    return render_template("posts.html", posts=posts)


@app.route('/posts/<int:id>')
def post(id):
    post = Posts.query.get_or_404(id)
    return render_template('post.html', post=post)


@app.route('/posts/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_post(id):
    post = Posts.query.get_or_404(id)
    form = PostForm()
    if form.validate_on_submit():
        post.title = form.title.data
        #post.author = form.author.data
        post.slug = form.slug.data
        post.content = form.content.data
        # Update Database
        db.session.add(post)
        db.session.commit()
        flash("Post Has Been Updated!")
        return redirect(url_for('post', id=post.id))

    if current_user.id == post.poster_id or current_user.id == 14:
        form.title.data = post.title
        #form.author.data = post.author
        form.slug.data = post.slug
        form.content.data = post.content
        return render_template('edit_post.html', form=form)
    else:
        flash("You Aren't Authorized To Edit This Post...")
        posts = Posts.query.order_by(Posts.date_posted)
        return render_template("posts.html", posts=posts)


# Add Post Page
@app.route('/add-post', methods=['GET', 'POST'])
# @login_required
def add_post():
    form = PostForm()

    if form.validate_on_submit():
        poster = current_user.id
        post = Posts(title=form.title.data, content=form.content.data,
                     poster_id=poster, slug=form.slug.data)
        # Clear The Form
        form.title.data = ''
        form.content.data = ''
        #form.author.data = ''
        form.slug.data = ''

        # Add post data to database
        db.session.add(post)
        db.session.commit()

        # Return a Message
        flash("Blog Post Submitted Successfully!")

    # Redirect to the webpage
    return render_template("add_post.html", form=form)


@app.route('/delete/<int:id>')
@login_required
def delete(id):
    if id == current_user.id:
        user_to_delete = Users.query.get_or_404(id)
        name = None
        form = UserForm()

        try:
            db.session.delete(user_to_delete)
            db.session.commit()
            flash("User Deleted Successfully!!")

            our_users = Users.query.order_by(Users.date_added)
            return render_template("add_user.html",
                                   form=form,
                                   name=name,
                                   our_users=our_users)

        except:
            flash("Whoops! There was a problem deleting user, try again...")
            return render_template("add_user.html",
                                   form=form, name=name, our_users=our_users)
    else:
        flash("Sorry, you can't delete that user! ")
        return redirect(url_for('dashboard'))


@app.route('/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update(id):
    form = UserForm()
    name_to_update = Users.query.get_or_404(id)
    if request.method == "POST":
        name_to_update.name = request.form['name']
        name_to_update.email = request.form['email']
        name_to_update.favorite_movie = request.form['favorite_movie']
        name_to_update.username = request.form['username']
        try:
            db.session.commit()
            flash("User Updated Successfully!")
            return render_template("update.html",
                                   form=form,
                                   name_to_update=name_to_update, id=id)
        except:
            flash("Error!  Looks like there was a problem...try again!")
            return render_template("update.html",
                                   form=form,
                                   name_to_update=name_to_update,
                                   id=id)
    else:
        return render_template("update.html",
                               form=form,
                               name_to_update=name_to_update,
                               id=id)


@app.route('/user/add', methods=['GET', 'POST'])
def add_user():
    name = None
    form = UserForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(email=form.email.data).first()
        if user is None:
            # Hash the password!!!
            hashed_pw = generate_password_hash(
                form.password_hash.data, "sha256")
            user = Users(username=form.username.data, name=form.name.data, email=form.email.data,
                         favorite_movie=form.favorite_movie.data, password_hash=hashed_pw)
            db.session.add(user)
            db.session.commit()
        name = form.name.data
        form.name.data = ''
        form.username.data = ''
        form.email.data = ''
        form.favorite_movie.data = ''
        form.password_hash.data = ''

        flash("User Added Successfully!")
    our_users = Users.query.order_by(Users.date_added)
    return render_template("add_user.html",
                           form=form,
                           name=name,
                           our_users=our_users)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/user/<name>')
def user(name):
    return render_template("user.html", user_name=name)


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def page_not_found(e):
    return render_template("500.html"), 500


@app.route('/name', methods=['GET', 'POST'])
def name():
    name = None
    form = NamerForm()
    # Validate Form
    if form.validate_on_submit():
        name = form.name.data
        form.name.data = ''
        flash("Form Submitted Successfully!")

    return render_template("name.html",
                           name=name,
                           form=form)


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    #author = db.Column(db.String(255))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    slug = db.Column(db.String(255))
    # Foreign Key To Link Users (refer to primary key of the user)
    poster_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    favorite_movie = db.Column(db.String(120))
    about_author = db.Column(db.Text(), nullable=True)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    profile_pic = db.Column(db.String(), nullable=True)

    def get_token(self, expires_sec=43200):
        serial = Serializer(app.config['SECRET KEY'], expires_in=expires_sec)
        return serial.dumps({'id': self.id}).decode('utf-8')

    @staticmethod
    def verify_token(token):
        serial = Serializer(app.config['SECRET KEY'])
        try:
            id = serial.loads(token)['id']
        except:
            return None
        return user.query.get(id)

    password_hash = db.Column(db.String(128))
    posts = db.relationship('Posts', backref='poster')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute!')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<Name %r>' % self.name
