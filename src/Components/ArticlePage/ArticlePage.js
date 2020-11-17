import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { withRouter } from "react-router-dom";
import c from './ArticlePage.module.scss';
import { connect } from 'react-redux';
import { fetchingNewArticle, fetchingUpdatedArticle } from '../../store/actions';

const ArticlePage = ({
  editing,
  submitNewArticleFormHandler,
  submitUpdateArticleFormHandler,
  fetchSuccess,
  newSlug,
  articleData,
  history, }
) => {

  const { handleSubmit, register, errors, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    if (data.tags) data.tagList = data.tags.map(({ name }) => name);
    console.log(data);
    editing
      ? submitUpdateArticleFormHandler(data, articleData.slug)
      : submitNewArticleFormHandler(data);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  useEffect(() => {
      if (fetchSuccess) {
        history.push(`/articles/${newSlug}`);
      }
  }, [fetchSuccess, history, newSlug]);

  const formTitle = editing ? "Edit article" : "Create new article";

  return (
    <>
    <form className={c.form} onSubmit={handleSubmit(onSubmit)}>
      <h6 className={c.title}>{ formTitle }</h6>
      <label htmlFor="title" className={c.label}>
        Title
      </label>
      <input
        className={c.input}
        id="title"
        name="title"
        placeholder="Title"
        defaultValue={ editing ?  articleData.title : '' }
        ref={register({
          required: 'required',
        })}
      />
        <div className={c.errorMessage}>
          {errors.title && errors.title.message}
        </div>

      <label htmlFor="description" className={c.label}>
        Short description
      </label>
      <input
        className={c.input}
        id="description"
        name="description"
        placeholder="Description"
        defaultValue={ editing ?  articleData.description : '' }
        ref={register({
          required: 'required',
        })}
      />
      <div className={c.errorMessage}>
        {errors.description && errors.description.message}
      </div>

      <label htmlFor="body" className={c.label}>
        Text
      </label>
      <textarea
        className={c.input}
        rows={5}
        id="body"
        name="body"
        defaultValue={ editing ?  articleData.body : '' }
        placeholder="Text"
        ref={register({
          required: 'required',
        })}
      />
        <div className={c.errorMessage}>
          {errors.body && errors.body.message}
        </div>
        {!editing &&
          <>
            <label htmlFor="tags" className={c.label}>Tags</label>
            <div className={c.tagsBox}>
              <ul className={c.tagList}>
                {fields.map((item, index) => {
                  const { id } = item;
                  return (
                    <li className={c.tagItem} key={id}>
                      <input
                        className={c.input}
                        name={`tags[${index}].name`}
                        ref={register()}
                        defaultValue=''
                      />
                      <button className={c.deleteTag} type="button" onClick={() => remove(index)}>
                        Delete
                      </button>
                    </li>
                    );
                  })
                }
              </ul>
              <button type="button" className={c.addTag} onClick={() => append()}>
                Add tag
              </button>
            </div>
          </>
        }
      <button className={c.buttonSubmit} type="submit">
        Send
      </button>
    </form>
  </>
  );
}

const mapStateToProps = (state) => {

  const { authentificationFormSending, userIsLogged } = state.currentUserReducer;
  const { fetchSuccess, slug: newSlug } = state.articleStateReducer;
  const { articleData } = state.articlesReducer;

  return {
    authentificationFormSending,
    userIsLogged,
    fetchSuccess,
    newSlug,
    articleData,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      submitNewArticleFormHandler: (data) => dispatch(fetchingNewArticle(data)),
      submitUpdateArticleFormHandler: (data, slug) => dispatch(fetchingUpdatedArticle(data, slug)),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticlePage));
