'use strict'

const Post = use('App/Models/Post')

const { validate } = use('Validator')

class PostController {
    async index({ view }) {
        // const posts = [
        //     {title: 'Message one', body: 'Some cool message one'},
        //     {title: 'Message two', body: 'Some cool message two'},
        //     {title: 'Message three', body: 'Some cool message three'}
        // ]

        const posts = await Post.all()

        return view.render('posts.index', {
            posts: posts.toJSON()
        })
    }

    async details({params,view}) {
        const post = await Post.find(params.id)

        return view.render('posts.details', {
            post
        }) 
    }

    async add({view}) {
        return view.render('posts.add')
    }

    async store({ request, response, session }) {
        //Validation
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }


        const post = new Post()

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({
            notification: 'Post Added!'
        })

        return response.redirect('/posts')

    }
    
}

module.exports = PostController
